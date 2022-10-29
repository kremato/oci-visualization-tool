import { common, identity, limits } from "oci-sdk";

export type Compartment = identity.models.Compartment;
export type IdentityRegion = identity.models.Region;
export type CommonRegion = common.Region;
export type RegionSubscription = identity.models.RegionSubscription;
export type HierarchyMap = Map<string, Compartment[]>;
export type ServiceSummary = limits.models.ServiceSummary;

export interface HierarchyHash {
  [id: string]: identity.models.Compartment[];
}

export enum Names {
  Compartment = "compartment",
  Region = "region",
  Service = "service",
}
