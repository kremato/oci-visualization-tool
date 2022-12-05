import { ResourceAvailabilityObject } from "common";

export const hide = (
  resourceAvailabilityObject: ResourceAvailabilityObject,
  hideNoAvailability: boolean,
  hideNoUsed: boolean,
  hideNoQuota: boolean
) => {
  const emptySymbols = ["0", "n/a"];
  const truthList = [
    emptySymbols.includes(resourceAvailabilityObject.available),
    emptySymbols.includes(resourceAvailabilityObject.used),
    emptySymbols.includes(resourceAvailabilityObject.quota),
  ];

  // if all three checkboxes are checked
  if (hideNoAvailability && hideNoUsed && hideNoQuota)
    return truthList[0] && truthList[1] && truthList[2];

  // if two checkboxes are checked
  if (hideNoAvailability && hideNoUsed) return truthList[0] && truthList[1];
  if (hideNoAvailability && hideNoQuota) return truthList[0] && truthList[2];
  if (hideNoUsed && hideNoQuota) return truthList[1] && truthList[2];

  // if one checkbox is checked
  if (hideNoAvailability) return truthList[0];
  if (hideNoUsed) return truthList[1];
  if (hideNoQuota) return truthList[2];

  return false;
};
