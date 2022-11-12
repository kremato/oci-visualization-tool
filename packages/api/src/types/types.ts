import type { StringHash } from "common";
import type { common, identity, limits } from "oci-sdk";

export type CommonRegion = common.Region; // CommonRegion is not used in app
export interface LimitDefinitionsPerLimitName
  extends StringHash<limits.models.LimitDefinitionSummary[]> {}
export interface LimitDefinitionsPerServiceName
  extends Map<string, limits.models.LimitDefinitionSummary[]> {}
export interface LimitDefinitionsPerScope
  extends Map<string, LimitDefinitionsPerServiceName> {}
export interface ServiceLimits
  extends Map<CommonRegion, LimitDefinitionsPerScope> {}
export interface IdentityADSet
  extends Set<identity.models.AvailabilityDomain> {}
export interface Token {
  postLimitsCount: number;
}
