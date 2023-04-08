import type { limits, identity } from "common";
import type { InferType } from "yup";
import type {
  myAvailabilityDomainSchema,
  storeLimitsSchema,
} from "../utils/validationSchemas";
import type { ParamsDictionary, Query } from "express-serve-static-core";

export interface LimitDefinitionsPerProperty<
  T extends limits.models.LimitDefinitionSummary
> extends Map<string, T[]> {}
export interface InputData extends InferType<typeof storeLimitsSchema> {}
export interface MyAvailabilityDomain
  extends InferType<typeof myAvailabilityDomainSchema>,
    Omit<identity.models.AvailabilityDomain, "name"> {}
export interface TypedRequest<T, U extends ParamsDictionary, K extends Query>
  extends Express.Request {
  body: T;
  params: U;
  query: K;
}
