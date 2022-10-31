import { common, identity, limits } from "oci-sdk";

export type Compartment = identity.models.Compartment;
export type IdentityRegion = identity.models.Region;
export type CommonRegion = common.Region;
export type RegionSubscription = identity.models.RegionSubscription;
export type HierarchyMap = Map<string, Compartment[]>;
export type ServiceSummary = Omit<limits.models.ServiceSummary, "name"> & {
  name: string;
};

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
  availibilityDomain: {
    name: string | undefined;
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

export type ServiceResourceHashAD = { [id: string]: [] };

export type ServiceResourceHashRegion = {
  [id: string]: ResourceObjectRegion[];
};

export type RegionServicesObject = {
  aDScope: ServiceResourceHashAD;
  regionScope: ServiceResourceHashRegion;
};

export type RegionsHash = {
  compartmentName: string;
  regions: { [id: string]: RegionServicesObject };
};

export type CompartmentsHash = {
  [id: string]: RegionsHash;
};
