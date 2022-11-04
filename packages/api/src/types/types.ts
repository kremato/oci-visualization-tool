import type { common, identity, limits } from "oci-sdk";

export type CommonRegion = common.Region; // CommonRegion is not used in app
export type LimitDefinitionsMap = Map<
  string,
  limits.models.LimitDefinitionSummary[]
>;
export type LimitDefinitionsPerScope = Map<string, LimitDefinitionsMap>;
export type ServiceLimits = Map<CommonRegion, LimitDefinitionsPerScope>;
export type IdentityADSet = Set<identity.models.AvailabilityDomain>;
