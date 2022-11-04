import type { identity, limits } from "oci-sdk";

// grep --exclude=\node_modules -rnw ../app -e "CompartmentsHash"
export type IdentityCompartment = identity.models.Compartment;
export type IdentityRegion = identity.models.Region; // IdentityRegion is not used anywhere
export type RegionSubscription = identity.models.RegionSubscription;
export type ServiceSummary = Omit<limits.models.ServiceSummary, "name"> & {
  name: string;
};
export type HierarchyMap = Map<string, IdentityCompartment[]>;
export interface StringHash<Value> {
  [id: string]: Value;
}
export type ResourceDataAD = {
  resourceName: string | undefined;
  availibilityDomainList: {
    aDName: string | undefined;
    available: string;
    used: string;
    quota: string;
  }[];
};
export type ResourceDataRegion = {
  resourceName: string | undefined;
  available: string;
  used: string;
};
export type ScopeObject = {
  aDScopeHash: StringHash<ResourceDataAD[]>;
  regionScopeHash: StringHash<ResourceDataRegion[]>;
};
export type CompartmentData = {
  compartmentName: string;
  regions: StringHash<ScopeObject>;
};
export type CompartmentsHash = StringHash<CompartmentData>;
export enum Names {
  Global = "global",
  Region = "region",
  AD = "AD",
  Compartment = "compartment",
  Service = "service",
  Scope = "scope",
}
export type InputData = {
  compartments: string[];
  regions: string[];
  services: string[];
  scopes: string[];
};
