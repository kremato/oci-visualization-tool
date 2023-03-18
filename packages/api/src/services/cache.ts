import path from "path";
import type {
  MyLimitDefinitionSummary,
  MyServiceSummary,
  UniqueLimit,
  identity,
} from "common";
import type {
  MyLimitDefinitionsPerProperty,
  RegionToServiceMap,
} from "../types/types";
import { log } from "../utils/log";

// Singleton
export class Cache {
  private static instance: Cache;
  private uniqueLimitCache: Map<string, UniqueLimit>;
  public compartments: identity.models.Compartment[];
  public regionSubscriptions: identity.models.RegionSubscription[];
  public serviceSubscriptions: MyServiceSummary[];
  public limitDefinitionsPerLimitName: MyLimitDefinitionsPerProperty;
  public limitDefinitionsPerService: Map<string, MyLimitDefinitionSummary[]>;
  /* stores service limits for each service, this is needed because
  limits.responses.GetResourceAvailabilityResponse does not include
  information about service limits */
  public serviceLimitMap: RegionToServiceMap;
  public availabilityDomainsPerRegion: Map<
    identity.models.RegionSubscription,
    identity.models.AvailabilityDomain[]
  >;

  private constructor() {
    this.uniqueLimitCache = new Map();
    this.compartments = [];
    this.regionSubscriptions = [];
    this.serviceSubscriptions = [];
    this.limitDefinitionsPerLimitName = new Map();
    this.limitDefinitionsPerService = new Map();
    this.serviceLimitMap = new Map();
    this.availabilityDomainsPerRegion = new Map();
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
      log(
        path.basename(__filename),
        `Adding UniqueLimit with resourceAvailibility.length === 0
        into LimitSet is not advised, operation refused`
      );
      return;
    }

    if (this.hasLimit(uniqueLimit)) return;

    this.uniqueLimitCache.set(this.toLimitString(uniqueLimit), uniqueLimit);
  }

  hasLimit(item: UniqueLimit): UniqueLimit | undefined {
    return this.uniqueLimitCache.get(this.toLimitString(item));
  }

  clear(): void {
    this.uniqueLimitCache.clear();
    this.serviceLimitMap.clear();
  }
}
