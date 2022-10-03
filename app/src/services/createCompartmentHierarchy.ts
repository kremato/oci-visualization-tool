import type { Region } from "oci-common";
import * as identity from "oci-identity";
import { HierarchyMap } from "../types/types";
import { getCompartment } from "./getCompartment";

/* returns HierarchyMap in which the root compartment, that was fetchech 
with the use of rootCompartmentId can be found under 'root' key */
export const createCompartmentHierarchy = async (
  rootCompartmentId: string,
  compartments: identity.models.Compartment[],
  identityClient: identity.IdentityClient
): Promise<HierarchyMap> => {
  let compartmentDependecyHash = new Map<string, identity.models.Compartment[]>(
    [[rootCompartmentId, []]]
  );
  for (let compartment of compartments) {
    const parent = compartmentDependecyHash.get(compartment.compartmentId);
    if (!parent) {
      compartmentDependecyHash.set(compartment.compartmentId, [compartment]);
    } else {
      parent.push(compartment);
    }
  }

  if (compartmentDependecyHash.has("root")) {
    console.debug(
      "While creating compartment hierarchy, existing root key has been detected"
    );
  }

  const rootCompartment = await getCompartment(
    identityClient,
    rootCompartmentId
  );
  compartmentDependecyHash.set("root", [rootCompartment]);

  return compartmentDependecyHash;
};
