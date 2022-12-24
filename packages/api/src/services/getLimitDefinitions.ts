import { requests, models } from "oci-limits";
import { getLimitsClient } from "../clients/getLimitsClient";
import { Provider } from "../clients/provider";
import type {
  LimitDefinitionsPerProperty,
  LimitDefinitionsPerScope,
} from "../types/types";
import { outputToFile } from "../utils/outputToFile";
import path from "path";
import type { MyLimitDefinitionSummary } from "common";
import type { common } from "oci-sdk";

const validateLimitDefinitionSummary = (
  limitDefinitionSummary: models.LimitDefinitionSummary
) => {
  const log: string[] = [];
  if (!limitDefinitionSummary.name) {
    log.push("name");
  }
  if (!limitDefinitionSummary.serviceName) {
    log.push("serviceName");
  }
  if (!limitDefinitionSummary.scopeType) {
    log.push("scopeType");
  }
  if (
    limitDefinitionSummary.scopeType &&
    limitDefinitionSummary.scopeType ===
      models.LimitDefinitionSummary.ScopeType.UnknownValue
  ) {
    console.log(
      `[${path.basename(
        __filename
      )}]: LimitDefinition is filtered out since 'ScopeType' is set to '${
        limitDefinitionSummary.scopeType
      }'`
    );
    return false;
  }
  if (log.length !== 0) {
    console.log(
      `[${path.basename(
        __filename
      )}]: LimitDefinition is filtered out since ${log} is/are 'undefined'`
    );
    return false;
  }
  return true;
};

const perScope = (
  limitDefinitionsPerScopePerServiceName: LimitDefinitionsPerScope,
  limitDefinitionSummary: MyLimitDefinitionSummary
) => {
  const itemScope = limitDefinitionSummary.scopeType;
  const serviceLimitDefinitions =
    limitDefinitionsPerScopePerServiceName.get(itemScope);
  /* serviceLimitDefinitions should not ever be undefined, because limitDefinitionsPerScopePerServiceName was set
      with all four possibble values of ScopeType and so limitDefinitionsPerScopePerServiceName.get(itemScope) always
      returns something */
  perServiceName(serviceLimitDefinitions!, limitDefinitionSummary);
};

const perServiceName = (
  limitDefinitionsPerServiceName: LimitDefinitionsPerProperty,
  limitDefinitionSummary: MyLimitDefinitionSummary
) => {
  const serviceName = limitDefinitionSummary.serviceName;

  /* if (!serviceName) {
    console.log(
      `[${path.basename(
        __filename
      )}]: LimitDefinition is filtered out since serviceName in LimitDefinition is 'undefined'`
    );
    return;
  } */

  if (!limitDefinitionsPerServiceName.has(serviceName)) {
    limitDefinitionsPerServiceName.set(serviceName, [limitDefinitionSummary]);
  } else {
    limitDefinitionsPerServiceName
      .get(serviceName)
      ?.push(limitDefinitionSummary);
  }
};

const perLimitName = (
  limitDefinitionsPerLimitName: LimitDefinitionsPerProperty,
  limitDefinitionSummary: MyLimitDefinitionSummary
) => {
  const limitName = limitDefinitionSummary.name;

  /* if (!limitName) {
    console.log(
      `[${path.basename(
        __filename
      )}]: LimitDefinition is filtered out since 'name' in LimitDefinition is 'undefined'`
    );
    return;
  } */

  /* if (!limitDefinitionSummary.serviceName) {
    console.log(
      `[${path.basename(
        __filename
      )}]: LimitDefinition is filtered out since 'serviceName' in LimitDefinition is 'undefined'`
    );
    return;
  } */

  const entry = limitDefinitionsPerLimitName.get(limitName);
  if (!entry) {
    limitDefinitionsPerLimitName.set(limitName, [limitDefinitionSummary]);
  } else {
    entry.push(limitDefinitionSummary);
  }
};

export const getLimitDefinitions = async (
  type: "perScope" | "perServiceName" | "perLimitName",
  region?: common.Region
): Promise<LimitDefinitionsPerScope | LimitDefinitionsPerProperty> => {
  const limitsClient = getLimitsClient();
  // TODO: je tu potrebne nastavovat region, nie je to pre kazdy region rovnake?
  // pise, ze must be tenancy, a asi na tom nieco je
  if (region !== undefined) limitsClient.region = region;
  const listLimitDefinitionsRequest: requests.ListLimitDefinitionsRequest = {
    compartmentId: Provider.getInstance().provider.getTenantId(),
  };
  const limitDefinitionsPerScopePerServiceName = new Map<
    string,
    LimitDefinitionsPerProperty
  >();
  const limitDefinitionsPerServiceName: LimitDefinitionsPerProperty = new Map();
  const limitDefinitionsPerLimitName: LimitDefinitionsPerProperty = new Map();

  const scopeType = models.LimitDefinitionSummary.ScopeType;
  for (const scope of [scopeType.Global, scopeType.Region, scopeType.Ad]) {
    limitDefinitionsPerScopePerServiceName.set(
      scope,
      new Map<string, MyLimitDefinitionSummary[]>()
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
      if (!validateLimitDefinitionSummary(limitDefinitionSummary)) continue;
      // TODO: filter global scope, in case of return to the global scope, delete
      if (limitDefinitionSummary.scopeType === "GLOBAL") continue;
      if (type === "perScope") {
        perScope(
          limitDefinitionsPerScopePerServiceName,
          limitDefinitionSummary as MyLimitDefinitionSummary
        );
      } else if (type === "perServiceName") {
        perServiceName(
          limitDefinitionsPerServiceName,
          limitDefinitionSummary as MyLimitDefinitionSummary
        );
      } else {
        perLimitName(
          limitDefinitionsPerLimitName,
          limitDefinitionSummary as MyLimitDefinitionSummary
        );
      }
    }
    opc = listLimitDefinitionsResponse.opcNextPage;
  } while (opc);

  outputToFile("test/limitDefinitionListAllJSON.txt", logJSON);
  if (type === "perScope") return limitDefinitionsPerScopePerServiceName;
  if (type === "perServiceName") return limitDefinitionsPerServiceName;
  return limitDefinitionsPerLimitName;
};
