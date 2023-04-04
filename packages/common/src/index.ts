import type { limits } from "common";

export type MyServiceSummary = Omit<
  limits.models.ServiceSummary,
  "name" | "description"
> & {
  name: string;
  description: string;
};

interface StringHash<Value> {
  [id: string]: Value;
}

export interface MyLimitDefinitionSummary
  extends Omit<
    limits.models.LimitDefinitionSummary,
    "name" | "serviceName" | "scopeType"
  > {
  name: string;
  serviceName: string;
  scopeType:
    | limits.models.LimitDefinitionSummary.ScopeType.Ad
    | limits.models.LimitDefinitionSummary.ScopeType.Region;
}

export interface LimitDefinitionsPerProperty
  extends StringHash<MyLimitDefinitionSummary[]> {}

export interface ResourceObject {
  scope: string | undefined;
  serviceLimit: string;
  available: string;
  used: string;
  quota: string;
}

export interface UniqueLimit {
  limitName: string;
  serviceName: string;
  compartmentId: string;
  compartmentName: string;
  scope:
    | limits.models.LimitDefinitionSummary.ScopeType.Ad
    | limits.models.LimitDefinitionSummary.ScopeType.Region;
  regionId: string;
  isDeprecated?: boolean;
  resources: ResourceObject[];
  resourceSum: ResourceObject;
}

export * as identity from "oci-identity";
export * as limits from "oci-limits";
export * as common from "oci-common";
