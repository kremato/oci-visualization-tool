/* import { HierarchyMap, Compartment } from "../types/types";

 returns HierarchyMap in which the root compartment, that was fetchech 
with the use of rootCompartmentId can be found under 'root' key
export const createCompartmentHierarchy = (
  rootCompartmentId: string,
  compartments: Compartment[],
): HierarchyMap => {
  let compartmentDependecyHash: HierarchyMap = new Map<string, Compartment[]>(
    [[rootCompartmentId, []]]
  );
  for (let compartment of compartments) {

    if (!compartment.compartmentId) {
      compartmentDependecyHash.set("root", [compartment]);
      continue
    }

    const parent = compartmentDependecyHash.get(compartment.compartmentId);
    if (!parent) {
      compartmentDependecyHash.set(compartment.compartmentId, [compartment]);
    } else {
      parent.push(compartment);
    }
  }

  return compartmentDependecyHash;
}; */

import { IdentityCompartment } from "common";
import { HierarchyHash } from "../types/types";

/* For now, this function assumes, that there is a root compartment in the compartmentsList 
   and that this root compartment is received as an argument. */
export const createCompartmentHierarchy = (
  rootCompartmentId: string,
  compartments: IdentityCompartment[]
): HierarchyHash => {
  let compartmentDependecyHash: HierarchyHash = {
    [rootCompartmentId]: [],
  };

  for (let compartment of compartments) {
    if (!compartment.compartmentId) {
      compartmentDependecyHash["rootId"] = [compartment];
      continue;
    }

    const children = compartmentDependecyHash[compartment.compartmentId];
    if (!children) {
      compartmentDependecyHash[compartment.compartmentId] = [compartment];
    } else {
      children.push(compartment);
    }
  }

  return compartmentDependecyHash;
};
