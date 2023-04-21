import type { limits, identity } from "common";
import type { InferType } from "yup";
import type { myAvailabilityDomainSchema } from "../utils/validationSchemas";
import type { ParamsDictionary, Query } from "express-serve-static-core";

export interface LimitDefinitionsPerProperty<
  T extends limits.models.LimitDefinitionSummary
> extends Map<string, T[]> {}

export interface MyAvailabilityDomain
  extends InferType<typeof myAvailabilityDomainSchema>,
    Omit<identity.models.AvailabilityDomain, "name"> {}

export type StoreLimitsBody = {
  compartments: string[];
  regions: string[];
  services: string[];
  limits?: { limitName: string; serviceName: string }[];
  invalidateCache: boolean;
};

export interface TypedRequest<T, U extends ParamsDictionary, K extends Query>
  extends Express.Request {
  body: T;
  params: U;
  query: K;
}
