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
import { log } from "../utils/log";

const filePath = path.basename(__filename);

const validateLimitDefinitionSummary = (
  limitDefinitionSummary: models.LimitDefinitionSummary
): boolean => {
  const missingProperties: string[] = [];
  if (!limitDefinitionSummary.name) {
    missingProperties.push("name");
  }
  if (!limitDefinitionSummary.serviceName) {
    missingProperties.push("serviceName");
  }
  if (!limitDefinitionSummary.scopeType) {
    missingProperties.push("scopeType");
  }
  if (
    limitDefinitionSummary.scopeType &&
    limitDefinitionSummary.scopeType ===
      models.LimitDefinitionSummary.ScopeType.UnknownValue
  ) {
    log(
      filePath,
      `limitDefinitionSummary is filtered out since 'ScopeType' is set to '${limitDefinitionSummary.scopeType}'`
    );
    return false;
  }
  if (missingProperties.length !== 0) {
    log(
      filePath,
      `limitDefinitionSummary is filtered out since ${missingProperties} is/are 'undefined'`
    );
    return false;
  }
  return true;
};

const perScope = (
  limitDefinitionsPerScopePerServiceName: LimitDefinitionsPerScope,
  limitDefinitionSummary: MyLimitDefinitionSummary
): void => {
  const serviceLimitDefinitions = limitDefinitionsPerScopePerServiceName.get(
    limitDefinitionSummary.scopeType
  );

  if (!serviceLimitDefinitions) {
    log(filePath, `no such scope as ${limitDefinitionSummary.scopeType} found`);
  }
  perServiceName(serviceLimitDefinitions!, limitDefinitionSummary);
};

const perServiceName = (
  limitDefinitionsPerServiceName: LimitDefinitionsPerProperty,
  limitDefinitionSummary: MyLimitDefinitionSummary
): void => {
  const serviceName = limitDefinitionSummary.serviceName;

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
): void => {
  const limitName = limitDefinitionSummary.name;

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
  // is it neccessary to set region? they do so in the examples on github...
  if (region !== undefined) limitsClient.region = region;
  const listLimitDefinitionsRequest: requests.ListLimitDefinitionsRequest = {
    // must be tenancy
    compartmentId: Provider.getInstance().provider.getTenantId(),
  };
  const limitDefinitionsPerScopePerServiceName = new Map<
    string,
    LimitDefinitionsPerProperty
  >();
  const limitDefinitionsPerProperty: LimitDefinitionsPerProperty = new Map();

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
    let limitDefinitionSummaries: models.LimitDefinitionSummary[] = [];
    let opcNextPage = "";
    try {
      const listLimitDefinitionsResponse =
        await limitsClient.listLimitDefinitions(listLimitDefinitionsRequest);
      limitDefinitionSummaries = listLimitDefinitionsResponse.items;
      opcNextPage = listLimitDefinitionsResponse.opcNextPage;
    } catch (error) {
      log(
        filePath,
        "fetching of limitDefinitionSummaries failed, ABORTING further fetching"
      );
      break;
    }
    logJSON += JSON.stringify(limitDefinitionSummaries, null, 4);
    for (const limitDefinitionSummary of limitDefinitionSummaries) {
      if (!validateLimitDefinitionSummary(limitDefinitionSummary)) continue;
      // filter global scope, in case of return to the global scope, delete this
      if (limitDefinitionSummary.scopeType === "GLOBAL") continue;
      if (type === "perScope") {
        perScope(
          limitDefinitionsPerScopePerServiceName,
          limitDefinitionSummary as MyLimitDefinitionSummary
        );
      } else if (type === "perServiceName") {
        perServiceName(
          limitDefinitionsPerProperty,
          limitDefinitionSummary as MyLimitDefinitionSummary
        );
      } else {
        perLimitName(
          limitDefinitionsPerProperty,
          limitDefinitionSummary as MyLimitDefinitionSummary
        );
      }
    }
    opc = opcNextPage;
  } while (opc);

  outputToFile("test/limitDefinitionListAllJSON.txt", logJSON);
  if (type === "perScope") return limitDefinitionsPerScopePerServiceName;
  return limitDefinitionsPerProperty;
};
