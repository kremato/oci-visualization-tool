import path from "path";
import type {
  MyLimitDefinitionSummary,
  MyServiceSummary,
  UniqueLimit,
  identity,
} from "common";
import type {
  LimitDefinitionsPerProperty,
  ServiceToServiceLimits,
  Token,
} from "../types/types";
import { log } from "../utils/log";

// Singleton
export class Cache {
  private static instance: Cache;
  private limitCache: Map<string, UniqueLimit>;
  public compartments: identity.models.Compartment[];
  public regionSubscriptions: identity.models.RegionSubscription[];
  public serviceSubscriptions: MyServiceSummary[];
  public limitDefinitionsPerLimitName: LimitDefinitionsPerProperty;
  public limitDefinitionsPerRegionPerService: Map<
    identity.models.RegionSubscription,
    Map<string, MyLimitDefinitionSummary[]>
  >;
  /* stores service limits for each service, this is needed because
  limits.responses.GetResourceAvailabilityResponse does not include
  information about service limits */
  public serviceLimitMap: ServiceToServiceLimits;
  public availabilityDomainsPerRegion: Map<
    identity.models.RegionSubscription,
    identity.models.AvailabilityDomain[]
  >;
  public token: Token;

  private constructor() {
    this.limitCache = new Map();
    this.compartments = [];
    this.regionSubscriptions = [];
    this.serviceSubscriptions = [];
    this.limitDefinitionsPerLimitName = new Map();
    this.limitDefinitionsPerRegionPerService = new Map();
    this.serviceLimitMap = new Map();
    this.availabilityDomainsPerRegion = new Map();
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
      log(
        path.basename(__filename),
        `Adding UniqueLimit with resourceAvailibility.length === 0
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
    this.serviceLimitMap.clear();
  }
}
