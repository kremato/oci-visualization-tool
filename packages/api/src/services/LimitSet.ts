import path from "path";
import type { UniqueLimit } from "common";

// no iterator available
export class LimitSet {
  private static instance: LimitSet;
  private map: Map<string, UniqueLimit>;
  constructor() {
    this.map = new Map();
    // this[Symbol.iterator] = this.values;
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new LimitSet();
    return this.instance;
  }

  /* private validateUniqueLimitAsKey(uniqueLimit: UniqueLimit): boolean {
    const validationList = [
      uniqueLimit.compartmentId,
      `${uniqueLimit.regionId}`,
      uniqueLimit.scope,
      uniqueLimit.serviceName,
      uniqueLimit.limitName,
    ];
    console.log("ADDING TO LIMIT SET:");
    console.log(uniqueLimit);

    const validationResult = validationList.reduce(
      (accumulator, currentValue) => accumulator && !currentValue.includes(","),
      true
    );
    return validationResult;
  } */

  toLimitString(uniqueLimit: UniqueLimit) {
    return `
    ${uniqueLimit.compartmentId}
    ${uniqueLimit.regionId}
    ${uniqueLimit.scope}
    ${uniqueLimit.serviceName}
    ${uniqueLimit.limitName}
    `;
  }

  add(uniqueLimit: UniqueLimit) {
    if (uniqueLimit.resourceAvailability.length === 0) {
      console.log(
        `[${path.basename(__filename)}]:
        Adding UniqueLimit with resourceAvailibility.length === 0
        into LimitSet is not advised, operation refused`
      );
      return;
    }

    /* if (this.validateUniqueLimitAsKey(uniqueLimit)) {
      console.log(
        `[${path.basename(__filename)}]:
        One or more of UniqeLimit idnetifiers contains a ','.
        Operation 'add' refused`
      );
    } */

    if (this.has(uniqueLimit)) return;

    this.map.set(this.toLimitString(uniqueLimit), uniqueLimit);
  }

  has(item: UniqueLimit) {
    return this.map.get(this.toLimitString(item));
  }
}
