import type { common, identity, limits } from "oci-sdk";

export type IdentityCompartment = identity.models.Compartment;
export type IdentityRegion = identity.models.Region;
export type CommonRegion = common.Region;
export type RegionSubscription = identity.models.RegionSubscription;
export type ServiceSummary = Omit<limits.models.ServiceSummary, "name"> & {
  name: string;
};
export type HierarchyMap = Map<string, IdentityCompartment[]>;
export interface StringHash<Value> {
  [id: string]: Value;
}
export type ResourceObjectAD = {
  resourceName: string | undefined;
  availibilityDomainList: {
    aDName: string | undefined;
    available: string;
    used: string;
    quota: string;
  }[];
};
export type ResourceObjectRegion = {
  resourceName: string | undefined;
  available: string;
  used: string;
};
export type ServiceResourceHashAD = StringHash<ResourceObjectAD[]>;
export type ServiceResourceHashRegion = StringHash<ResourceObjectRegion[]>;
export type ServiceScopeObject = {
  aDScope: ServiceResourceHashAD;
  regionScope: ServiceResourceHashRegion;
};
export type CompartmentData = {
  compartmentName: string;
  regions: StringHash<ServiceScopeObject>;
};
export type CompartmentsHash = StringHash<CompartmentData>;
export type InputData = {
  compartments: string[];
  regions: string[];
  services: string[];
};
