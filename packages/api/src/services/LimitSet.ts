import type { UniqueLimit } from "../types/types";

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
        `Adding UniqueLimit with resourceAvailibility.length === 0
        into LimitSet is not advised, operation refused`
      );
      return;
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
