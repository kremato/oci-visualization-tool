import * as identity from "oci-identity";

export type Compartment = identity.models.Compartment;
export type Region = identity.models.Region
export type RegionSubscription = identity.models.RegionSubscription[]
export type HierarchyMap = Map<string, Compartment[]>;

export interface HierarchyHash {
  [id: string]: identity.models.Compartment[];
}
