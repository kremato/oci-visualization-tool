import type { StringHash, MyLimitDefinitionSummary } from "common";
import type { common, identity, limits } from "oci-sdk";

export type CommonRegion = common.Region; // CommonRegion is not used in app
export interface LimitDefinitionsPerProperty
  extends Map<string, MyLimitDefinitionSummary[]> {}
export interface LimitDefinitionsPerScope
  extends Map<string, LimitDefinitionsPerProperty> {}
export interface ServiceLimits
  extends Map<CommonRegion, LimitDefinitionsPerScope> {}
export interface IdentityADSet
  extends Set<identity.models.AvailabilityDomain> {}
export interface Token {
  count: number;
}
