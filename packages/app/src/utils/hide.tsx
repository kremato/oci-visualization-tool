import { ResourceAvailabilityObject } from "common";

// TODO: logic needs refactoring
export const hide = (
  resourceAvailabilityObject: ResourceAvailabilityObject,
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

  // this should not happen
  if (truthList.length !== 4 || checkboxValues.length !== 4) {
    console.log(
      `"truthList" has a length of ${truthList} and "checkboxValues" has a length of ${checkboxValues.length}, length of 4 is required`
    );
    return false;
  }

  // if all three checkboxes are checked (SAUQ)
  if (
    checkboxValues.reduce(
      (accumulator, currentValue) => accumulator && currentValue,
      true
    )
  )
    return truthList.reduce(
      (accumulator, currentValue) => accumulator && currentValue,
      true
    );

  // if three are checked (SAU, SAQ, AUQ, SUQ)
  if (checkboxValues[0] && checkboxValues[1] && checkboxValues[2])
    return truthList[0] && truthList[1] && truthList[2];
  if (checkboxValues[0] && checkboxValues[1] && checkboxValues[3])
    return truthList[0] && truthList[1] && truthList[3];
  if (checkboxValues[1] && checkboxValues[2] && checkboxValues[3])
    return truthList[1] && truthList[2] && truthList[3];
  if (checkboxValues[0] && checkboxValues[2] && checkboxValues[3])
    return truthList[0] && truthList[2] && truthList[3];

  // if two checkboxes are checked (SA, SU, SQ, AU, AQ, UQ)
  if (checkboxValues[0] && checkboxValues[1])
    return truthList[0] && truthList[1];
  if (checkboxValues[0] && checkboxValues[2])
    return truthList[0] && truthList[2];
  if (checkboxValues[0] && checkboxValues[3])
    return truthList[0] && truthList[3];
  if (checkboxValues[1] && checkboxValues[2])
    return truthList[1] && truthList[2];
  if (checkboxValues[1] && checkboxValues[3])
    return truthList[1] && truthList[3];
  if (checkboxValues[2] && checkboxValues[3])
    return truthList[2] && truthList[3];

  // if one checkbox is checked (S, A, U, Q)
  if (checkboxValues[0]) return truthList[0];
  if (checkboxValues[1]) return truthList[1];
  if (checkboxValues[2]) return truthList[2];
  if (checkboxValues[3]) return truthList[3];

  return false;

  /* const emptySymbols = ["0", "n/a"];
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

  return false; */
};
