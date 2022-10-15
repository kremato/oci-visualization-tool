import { LimitsClient, requests, models } from "oci-limits";
import { getLimitsClient } from "../clients/getLimitsClient";
import type {
  CommonRegion,
  LimitDefinitionsMap,
  LimitDefinitionsPerScope,
} from "../types/types";

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
  tenancyId: string,
  scoped = false
): Promise<LimitDefinitionsPerScope | LimitDefinitionsMap> => {

  const limitsClient = getLimitsClient()
  limitsClient.region = region
  const listLimitDefinitionsRequest: requests.ListLimitDefinitionsRequest = {
    compartmentId: tenancyId,
  };
  const servicesPerScope = new Map<string, LimitDefinitionsMap>();
  const servicesPerServiceName: LimitDefinitionsMap = new Map<
    string,
    models.LimitDefinitionSummary[]
  >();
  for (const scope of Object.values(models.LimitDefinitionSummary.ScopeType)) {
    servicesPerScope.set(
      scope,
      new Map<string, models.LimitDefinitionSummary[]>()
    );
  }

  let opc: string | undefined = undefined;
  do {
    !opc || (listLimitDefinitionsRequest.page = opc);
    const listLimitDefinitionsResponse =
      await limitsClient.listLimitDefinitions(listLimitDefinitionsRequest);
    for (const limitDefinitionSummary of listLimitDefinitionsResponse.items) {
      if (scoped) {
        perScope(servicesPerScope, limitDefinitionSummary);
      } else {
        perServiceName(servicesPerServiceName, limitDefinitionSummary);
      }
    }
    opc = listLimitDefinitionsResponse.opcNextPage;
  } while (opc);

  if (scoped) return servicesPerScope;

  return servicesPerServiceName;
};
