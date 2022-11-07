import type { common, identity, limits } from "oci-sdk";

export type CommonRegion = common.Region; // CommonRegion is not used in app
export interface LimitDefinitionsMap
  extends Map<string, limits.models.LimitDefinitionSummary[]> {}
export interface LimitDefinitionsPerScope
  extends Map<string, LimitDefinitionsMap> {}
export interface ServiceLimits
  extends Map<CommonRegion, LimitDefinitionsPerScope> {}
export interface IdentityADSet
  extends Set<identity.models.AvailabilityDomain> {}
export interface Token {
  postLimitsCount: number;
}
