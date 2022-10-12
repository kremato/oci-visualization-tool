import type * as identity from "oci-identity";

export type Compartment = identity.models.Compartment;
export type Region = identity.models.Region;
export type HierarchyMap = Map<string, Compartment[]>;
