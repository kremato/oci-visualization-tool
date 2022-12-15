import type { identity, limits } from "oci-sdk";

// grep --exclude=\node_modules -rnw ../app -e "CompartmentsHash"
export type IdentityCompartment = identity.models.Compartment;
export type IdentityRegion = identity.models.Region; // IdentityRegion is not used anywhere
export type RegionSubscription = identity.models.RegionSubscription;
export type ServiceSummary = Omit<
  limits.models.ServiceSummary,
  "name" | "description"
> & {
  name: string;
  description: string;
};

export interface HierarchyMap extends Map<string, IdentityCompartment[]> {}

export interface StringHash<Value> {
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
    | limits.models.LimitDefinitionSummary.ScopeType.Region
    | limits.models.LimitDefinitionSummary.ScopeType.Global;
}

export interface LimitDefinitionsPerProperty
  extends StringHash<MyLimitDefinitionSummary[]> {}

export interface ResourceDataAD {
  resourceName: string | undefined;
  availibilityDomainList: {
    aDName: string | undefined;
    available: string;
    used: string;
    quota: string;
  }[];
}
export interface ResourceDataRegion {
  resourceName: string | undefined;
  available: string;
  used: string;
  quota: string;
}
export interface ScopeObject {
  aDScopeHash: StringHash<ResourceDataAD[]>;
  regionScopeHash: StringHash<ResourceDataRegion[]>;
}
export interface ResourceDataGlobal {
  resourceName: string | undefined;
  available: string;
  used: string;
  quota: string;
}
export interface CompartmentData {
  compartmentName: string;
  regions: StringHash<ScopeObject>;
  global?: StringHash<ResourceDataGlobal[]>;
}
export interface CompartmentsHash extends StringHash<CompartmentData> {}
export enum Names {
  Global = "global",
  Region = "region",
  AD = "AD",
  Compartment = "compartment",
  Service = "service",
  Scope = "scope",
  Limit = "limit",
}
export interface InputData {
  compartments: string[];
  regions: string[];
  services: string[];
  scopes: string[];
  limits: { limitName: string; serviceName: string }[];
  invalidateCache: boolean;
}

export interface ResponseTree {
  name: string;
  children: ResponseTree[];
  limits?: UniqueLimit[];
}

/* export interface ScopeType extends Omit<
limits.models.LimitDefinitionSummary.ScopeType,
"name" | "serviceName" | "scopeType"
> {
name: string;
serviceName: string;
scopeType:
| limits.models.LimitDefinitionSummary.ScopeType.Ad
| limits.models.LimitDefinitionSummary.ScopeType.Region
| limits.models.LimitDefinitionSummary.ScopeType.Global;
} */

export interface ResourceAvailabilityObject {
  serviceLimit: string;
  available: string;
  used: string;
  quota: string;
  availabilityDomain?: string;
}

export interface UniqueLimit {
  serviceName: string;
  compartmentId: string;
  scope:
    | limits.models.LimitDefinitionSummary.ScopeType.Ad
    | limits.models.LimitDefinitionSummary.ScopeType.Region
    | limits.models.LimitDefinitionSummary.ScopeType.Global;
  regionId?: string;
  isDeprecated?: boolean;
  limitName: string;
  compartmentName: string;
  resourceAvailability: ResourceAvailabilityObject[];
  resourceAvailabilitySum: ResourceAvailabilityObject;
}
