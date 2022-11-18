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

  toLimitString(uniqueLimit: UniqueLimit) {
    return `
    ${uniqueLimit.compartmendId},
    ${uniqueLimit.regionId},
    ${uniqueLimit.scope},
    ${uniqueLimit.serviceName},
    ${uniqueLimit.limitName}
    `;
  }

  add(item: UniqueLimit) {
    if (item.resourceAvailibility.length === 0) {
      console.log(
        `[${path.basename(__filename)}]:
        Adding UniqueLimit with resourceAvailibility.length === 0
        into LimitSet is not advised, operation refused`
      );
      return;
    }
    const key = this.toLimitString(item);

    if (key.includes(",")) {
      console.log(
        `[${path.basename(__filename)}]:
        Key made out of UniqeLimit idnetifiers contains a ','.
        Operation 'add' refused`
      );
    }

    if (this.has(item)) return;

    this.map.set(this.toLimitString(item), item);
  }

  has(item: UniqueLimit) {
    return this.map.get(this.toLimitString(item));
  }

  values() {
    return this.map.values();
  }

  size() {
    return this.map.size;
  }
}
