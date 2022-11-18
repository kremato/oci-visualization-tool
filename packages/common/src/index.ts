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

export interface LimitDefinitionsPerProperty
  extends StringHash<limits.models.LimitDefinitionSummary[]> {}

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
  limits: string[];
}
