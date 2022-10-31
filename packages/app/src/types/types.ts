import { common, identity, limits } from "oci-sdk";

export type Compartment = identity.models.Compartment;
export type IdentityRegion = identity.models.Region;
export type CommonRegion = common.Region;
export type RegionSubscription = identity.models.RegionSubscription;
export type HierarchyMap = Map<string, Compartment[]>;
export type ServiceSummary = Omit<limits.models.ServiceSummary, "name"> & {
  name: string;
};
export interface StringHash<Value> {
  [id: string]: Value;
}
export interface HierarchyHash {
  [id: string]: identity.models.Compartment[];
}

export enum Names {
  Compartment = "compartment",
  Region = "region",
  Service = "service",
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
// export type ServiceResourceHashAD = Map<string, ResourceObjectAD[]>;
export type ServiceResourceHashAD = StringHash<ResourceObjectAD[]>;
// export type ServiceResourceHashRegion = Map<string, ResourceObjectRegion[]>;
export type ServiceResourceHashRegion = {
  [id: string]: ResourceObjectRegion[];
};
export type ServiceScopeObject = {
  aDScope: ServiceResourceHashAD;
  regionScope: ServiceResourceHashRegion;
};
// export type RegionToScope = Map<CommonRegion, RegionServicesObject>;
export type CompartmentData = {
  compartmentName: string;
  regions: StringHash<ServiceScopeObject>;
};
export type CompartmentsHash = StringHash<CompartmentData>;
