import type { LimitDefinitionsPerProperty } from "../types/types";
import type { limits } from "common";

const perProperty = <T extends limits.models.LimitDefinitionSummary>(
  limitDefinitionsPerLimitName: LimitDefinitionsPerProperty<T>,
  limitDefinitionSummary: T,
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

export const getLimitDefinitionsPerProperty = <
  T extends limits.models.LimitDefinitionSummary
>(
  limitDefinitionSummaries: T[],
  propertyKey: "name" | "serviceName"
): LimitDefinitionsPerProperty<T> => {
  const limitDefinitionsPerProperty: LimitDefinitionsPerProperty<T> = new Map();
  for (const limitDefinitionSummary of limitDefinitionSummaries) {
    perProperty(
      limitDefinitionsPerProperty,
      limitDefinitionSummary,
      propertyKey
    );
  }
  return limitDefinitionsPerProperty;
};
