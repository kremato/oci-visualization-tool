import type { limits, identity } from "common";
import type { InferType } from "yup";
import type {
  myAvailabilityDomainSchema,
  storeLimitsSchema,
} from "../utils/validationSchemas";

export interface LimitDefinitionsPerProperty<
  T extends limits.models.LimitDefinitionSummary
> extends Map<string, T[]> {}
export interface MyLimitValueSummary
  extends Omit<limits.models.LimitValueSummary, "name" | "scopeType"> {
  name: string;
  scopeType:
    | limits.models.LimitValueSummary.ScopeType.Ad
    | limits.models.LimitValueSummary.ScopeType.Region;
}
export interface InputData extends InferType<typeof storeLimitsSchema> {}
export interface MyAvailabilityDomain
  extends InferType<typeof myAvailabilityDomainSchema>,
    Omit<identity.models.AvailabilityDomain, "name"> {}
