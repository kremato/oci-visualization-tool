import type { MyLimitDefinitionSummary } from "common";
import type { common, identity, limits } from "oci-sdk";

export type CommonRegion = common.Region; // CommonRegion is not used in app
export interface LimitDefinitionsPerProperty
  extends Map<string, MyLimitDefinitionSummary[]> {}
export interface LimitDefinitionsPerScope
  extends Map<string, LimitDefinitionsPerProperty> {}
/* export interface ServiceLimits
  extends Map<CommonRegion, LimitDefinitionsPerScope> {} */
export interface Token {
  count: number;
}
export interface MyLimitValueSummary
  extends Omit<limits.models.LimitValueSummary, "name"> {
  name: string;
}
// key is service name
export interface ServiceLimitMap extends Map<string, MyLimitValueSummary[]> {}
