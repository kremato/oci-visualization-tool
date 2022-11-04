import type { CompartmentData, ScopeObject } from "common";

export const createCompartmentDataObject = (compartmentName: string) => {
  const compartmentData: CompartmentData = Object.create(null);
  compartmentData["compartmentName"] = compartmentName;
  compartmentData["regions"] = Object.create(null);
  return compartmentData;
};

export const createServiceScopeObject = () => {
  const serviceScopeObject: ScopeObject = Object.create(null);
  serviceScopeObject["aDScopeHash"] = Object.create(null);
  serviceScopeObject["regionScopeHash"] = Object.create(null);
  return serviceScopeObject;
};
