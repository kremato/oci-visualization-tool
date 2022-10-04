import * as identity from "oci-identity";

export type Compartment = identity.models.Compartment
export type HierarchyMap = Map<string, Compartment[]>;
