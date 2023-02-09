import type { MyLimitDefinitionSummary, limits } from "common";
import type { InferType } from "yup";
import type { storeLimitsSchema } from "../utils/validationSchemas";

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
export interface InputData extends InferType<typeof storeLimitsSchema> {}
