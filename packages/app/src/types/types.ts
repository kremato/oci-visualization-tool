import { identity } from "oci-sdk";

export interface HierarchyHash {
  [id: string]: identity.models.Compartment[];
}
