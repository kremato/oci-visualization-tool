import path from "path";
import type {
  IdentityCompartment,
  MyLimitDefinitionSummary,
  RegionSubscription,
  ServiceSummary,
  UniqueLimit,
} from "common";
import type { common } from "oci-sdk";
import type {
  LimitDefinitionsPerProperty,
  ServiceLimitMap,
  Token,
} from "../types/types";

// Singleton
export class Cache {
  private static instance: Cache;
  private limitCache: Map<string, UniqueLimit>;
  public compartments: IdentityCompartment[];
  public regions: common.Region[];
  public regionSubscriptions: RegionSubscription[];
  public serviceSubscriptions: ServiceSummary[];
  public limitDefinitionsPerLimitName: LimitDefinitionsPerProperty;
  public limitDefinitionsPerRegionPerService: Map<
    common.Region,
    Map<string, MyLimitDefinitionSummary[]>
  >;
  public serviceLimitMap: ServiceLimitMap;
  public token: Token;

  private constructor() {
    this.limitCache = new Map();
    this.compartments = [];
    this.regions = [];
    this.regionSubscriptions = [];
    this.serviceSubscriptions = [];
    this.limitDefinitionsPerLimitName = new Map();
    this.limitDefinitionsPerRegionPerService = new Map();
    this.serviceLimitMap = new Map();
    this.token = { count: 0 };
  }

  static getInstance(): Cache {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Cache();
    return this.instance;
  }

  toLimitString(uniqueLimit: UniqueLimit): string {
    return `
    ${uniqueLimit.compartmentId}
    ${uniqueLimit.regionId}
    ${uniqueLimit.scope}
    ${uniqueLimit.serviceName}
    ${uniqueLimit.limitName}
    `;
  }

  addLimit(uniqueLimit: UniqueLimit): void {
    if (uniqueLimit.resourceAvailability.length === 0) {
      console.log(
        `[${path.basename(__filename)}]:
        Adding UniqueLimit with resourceAvailibility.length === 0
        into LimitSet is not advised, operation refused`
      );
      return;
    }

    if (this.hasLimit(uniqueLimit)) return;

    this.limitCache.set(this.toLimitString(uniqueLimit), uniqueLimit);
  }

  hasLimit(item: UniqueLimit): UniqueLimit | undefined {
    return this.limitCache.get(this.toLimitString(item));
  }

  clear(): void {
    this.limitCache.clear();
  }
}
