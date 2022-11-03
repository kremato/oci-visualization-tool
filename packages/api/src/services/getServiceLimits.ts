import type { CommonRegion } from "../types/types";
import { LimitsClient, requests, models } from "oci-limits";
import { getLimitsClient } from "../clients/getLimitsClient";
import { Provider } from "../clients/provider";
import type {
  LimitDefinitionsMap,
  LimitDefinitionsPerScope,
} from "../types/types";
import { outputToFile } from "../utils/outputToFile";

const perScope = (
  servicesPerScope: LimitDefinitionsPerScope,
  limitDefinitionSummary: models.LimitDefinitionSummary
) => {
  const itemScope =
    limitDefinitionSummary.scopeType ||
    models.LimitDefinitionSummary.ScopeType.UnknownValue;
  const serviceLimitDefinitions = servicesPerScope.get(itemScope);
  /* serviceLimitDefinitions should not ever be undefined, because servicesPerScope was set
      with all four possibble values of ScopeType and so servicesPerScope.get(itemScope) always
      returns something */
  perServiceName(serviceLimitDefinitions!, limitDefinitionSummary);
};

const perServiceName = (
  servicesPerServiceName: LimitDefinitionsMap,
  limitDefinitionSummary: models.LimitDefinitionSummary
) => {
  const serviceName =
    limitDefinitionSummary.serviceName || "SERVICE NAME UNDEFINED";
  if (!servicesPerServiceName.has(serviceName)) {
    servicesPerServiceName.set(serviceName, [limitDefinitionSummary]);
  } else {
    servicesPerServiceName.get(serviceName)?.push(limitDefinitionSummary);
  }
};

export const getServiceLimits = async (
  region: CommonRegion,
  scoped = false
): Promise<LimitDefinitionsPerScope | LimitDefinitionsMap> => {
  const limitsClient = getLimitsClient();
  // TODO: je tu potrebne nastavovat region, nie je to pre kazdy region rovnake?
  // pise, ze must be tenancy, a asi na tom nieco je
  limitsClient.region = region;
  const listLimitDefinitionsRequest: requests.ListLimitDefinitionsRequest = {
    compartmentId: Provider.getInstance().provider.getTenantId(),
  };
  const servicesPerScope = new Map<string, LimitDefinitionsMap>();
  const servicesPerServiceName: LimitDefinitionsMap = new Map<
    string,
    models.LimitDefinitionSummary[]
  >();
  const scopeType = models.LimitDefinitionSummary.ScopeType;
  for (const scope of [scopeType.Global, scopeType.Region, scopeType.Ad]) {
    servicesPerScope.set(
      scope,
      new Map<string, models.LimitDefinitionSummary[]>()
    );
  }

  let opc: string | undefined = undefined;
  let logJSON: string = "";
  do {
    !opc || (listLimitDefinitionsRequest.page = opc);
    const listLimitDefinitionsResponse =
      await limitsClient.listLimitDefinitions(listLimitDefinitionsRequest);
    logJSON += JSON.stringify(listLimitDefinitionsResponse.items, null, 4);
    for (const limitDefinitionSummary of listLimitDefinitionsResponse.items) {
      if (scoped) {
        perScope(servicesPerScope, limitDefinitionSummary);
      } else {
        perServiceName(servicesPerServiceName, limitDefinitionSummary);
      }
    }
    opc = listLimitDefinitionsResponse.opcNextPage;
  } while (opc);

  outputToFile("test/limitDefinitionListAllJSON.txt", logJSON);
  if (scoped) return servicesPerScope;

  return servicesPerServiceName;
};
