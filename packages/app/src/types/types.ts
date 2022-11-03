import { identity } from "oci-sdk";

export interface HierarchyHash {
  [id: string]: identity.models.Compartment[];
}

export enum Names {
  Compartment = "compartment",
  Region = "region",
  Service = "service",
  AD = "AD",
}
