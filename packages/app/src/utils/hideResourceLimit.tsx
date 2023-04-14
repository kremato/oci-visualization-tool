import { ResourceObject } from "common";

export const hideResourceLimit = (
  resourceAvailabilityObject: ResourceObject,
  // hideNoServiceLimits, hideNoAvailability, hideNoUsed, hideNoQuota
  checkboxValues: [boolean, boolean, boolean, boolean]
) => {
  const emptySymbols = ["0", "n/a"];
  const truthList = [
    emptySymbols.includes(resourceAvailabilityObject.serviceLimit),
    emptySymbols.includes(resourceAvailabilityObject.available),
    emptySymbols.includes(resourceAvailabilityObject.used),
    emptySymbols.includes(resourceAvailabilityObject.quota),
  ];

  // even if there is only one match, hide
  for (let i = 0; i < checkboxValues.length; i++)
    if (checkboxValues[i] && truthList[i]) return true;
  return false;
};
