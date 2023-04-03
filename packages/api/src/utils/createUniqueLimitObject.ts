import type { identity, MyLimitDefinitionSummary, UniqueLimit } from "common";

export const createUniqueLimitObject = (
  compartment: identity.models.Compartment,
  limitDefinitionSummary: MyLimitDefinitionSummary,
  regionId: string
): UniqueLimit => ({
  limitName: limitDefinitionSummary.name,
  serviceName: limitDefinitionSummary.serviceName,
  compartmentId: compartment.id,
  compartmentName: compartment.name,
  scope: limitDefinitionSummary.scopeType,
  regionId,
  ...(limitDefinitionSummary.isDeprecated && {
    isDeprecated: limitDefinitionSummary.isDeprecated,
  }),
  resources: [],
  resourceSum: Object.create(null),
});
