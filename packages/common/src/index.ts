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

export interface ResponseTreeNode {
  name: string;
  children: ResponseTreeNode[];
  limits?: UniqueLimit[];
}

export interface ResourceAvailabilityObject {
  availabilityDomain: string | undefined;
  serviceLimit: string;
  available: string;
  used: string;
  quota: string;
}

export interface UniqueLimit {
  serviceName: string;
  compartmentId: string;
  scope:
    | limits.models.LimitDefinitionSummary.ScopeType.Ad
    | limits.models.LimitDefinitionSummary.ScopeType.Region;
  regionId: string;
  isDeprecated?: boolean;
  limitName: string;
  compartmentName: string;
  resourceAvailability: ResourceAvailabilityObject[];
  resourceAvailabilitySum: ResourceAvailabilityObject;
}

export * as identity from "oci-identity";
export * as limits from "oci-limits";
export * as common from "oci-common";
