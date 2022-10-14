import { identity, limits } from "oci-sdk";

export type Compartment = identity.models.Compartment;
export type Region = identity.models.Region
export type RegionSubscription = identity.models.RegionSubscription
export type HierarchyMap = Map<string, Compartment[]>;
export type ServiceSummary = limits.models.ServiceSummary

export type CheckboxHash = { [id: string]: boolean }

export interface HierarchyHash {
  [id: string]: identity.models.Compartment[];
}
