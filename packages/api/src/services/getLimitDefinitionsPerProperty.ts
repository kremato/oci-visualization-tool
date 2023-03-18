import type {
  LimitDefinitionsPerProperty,
  MyLimitDefinitionsPerProperty,
} from "../types/types";
import path from "path";
import { limits } from "common";
import { log } from "../utils/log";

const filePath = path.basename(__filename);

const limitDefinitionSummaryIsValid = (
  limitDefinitionSummary: limits.models.LimitDefinitionSummary
): boolean => {
  if (
    limitDefinitionSummary.scopeType ===
    limits.models.LimitDefinitionSummary.ScopeType.Global
  )
    return false;
  if (
    limitDefinitionSummary.scopeType &&
    limitDefinitionSummary.scopeType ===
      limits.models.LimitDefinitionSummary.ScopeType.UnknownValue
  ) {
    log(
      filePath,
      `limitDefinitionSummary is filtered out since 'ScopeType' is set to '${limitDefinitionSummary.scopeType}'`
    );
    return false;
  }
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
  if (missingProperties.length !== 0) {
    log(
      filePath,
      `limitDefinitionSummary is filtered out since ${missingProperties} is/are 'undefined'`
    );
    return false;
  }
  return true;
};

const perProperty = (
  limitDefinitionsPerLimitName: LimitDefinitionsPerProperty,
  limitDefinitionSummary: limits.models.LimitDefinitionSummary,
  propertyKey: "name" | "serviceName"
): void => {
  const propertyValue = limitDefinitionSummary[propertyKey];

  if (propertyValue === undefined) return;
  const entry = limitDefinitionsPerLimitName.get(propertyValue);
  if (!entry) {
    limitDefinitionsPerLimitName.set(propertyValue, [limitDefinitionSummary]);
  } else {
    entry.push(limitDefinitionSummary);
  }
};

export const getLimitDefinitionsPerProperty = (
  limitDefinitionSummaries: limits.models.LimitDefinitionSummary[],
  propertyKey: "name" | "serviceName",
  filter = false
): LimitDefinitionsPerProperty | MyLimitDefinitionsPerProperty => {
  const limitDefinitionsPerProperty: LimitDefinitionsPerProperty = new Map();
  for (const limitDefinitionSummary of limitDefinitionSummaries) {
    if (filter && !limitDefinitionSummaryIsValid(limitDefinitionSummary))
      continue;
    perProperty(
      limitDefinitionsPerProperty,
      limitDefinitionSummary,
      propertyKey
    );
  }
  return limitDefinitionsPerProperty;
};
