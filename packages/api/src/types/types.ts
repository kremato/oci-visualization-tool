import type { MyLimitDefinitionSummary, limits, identity } from "common";
import type { InferType } from "yup";
import type { storeLimitsSchema } from "../utils/validationSchemas";

export interface LimitDefinitionsPerProperty
  extends Map<string, limits.models.LimitDefinitionSummary[]> {}
export interface MyLimitDefinitionsPerProperty
  extends Map<string, MyLimitDefinitionSummary[]> {}
export interface MyLimitValueSummary
  extends Omit<limits.models.LimitValueSummary, "name" | "scopeType"> {
  name: string;
  scopeType:
    | limits.models.LimitValueSummary.ScopeType.Ad
    | limits.models.LimitValueSummary.ScopeType.Region;
}
// key is service name
export interface ServiceNameToServiceLimitsMap
  extends Map<string, MyLimitValueSummary[]> {}
// key is region id
export interface RegionToServiceMap
  extends Map<
    identity.models.RegionSubscription,
    ServiceNameToServiceLimitsMap
  > {}
export interface InputData extends InferType<typeof storeLimitsSchema> {}
