import type { MyLimitDefinitionSummary } from "common";
import type { common, identity, limits } from "oci-sdk";

export interface LimitDefinitionsPerProperty
  extends Map<string, MyLimitDefinitionSummary[]> {}
export interface LimitDefinitionsPerScope
  extends Map<string, LimitDefinitionsPerProperty> {}
export interface Token {
  count: number;
}
export interface MyLimitValueSummary
  extends Omit<limits.models.LimitValueSummary, "name"> {
  name: string;
}
// key is service name
export interface ServiceToServiceLimits
  extends Map<string, MyLimitValueSummary[]> {}
