import path from "path";
import type {
  MyLimitDefinitionSummary,
  MyServiceSummary,
  UniqueLimit,
  identity,
} from "common";
import type {
  LimitDefinitionsPerProperty,
  MyAvailabilityDomain,
} from "../types/types";
import { log } from "../utils/log";
import { getStartupData } from "./getStartupData";

// Singleton
export class Cache {
  public readonly Ready: Promise<any>;
  private static instance: Cache;
  private readonly uniqueLimitCache: Map<string, UniqueLimit> = new Map();
  public compartments: identity.models.Compartment[] = [];
  public regionSubscriptions: identity.models.RegionSubscription[] = [];
  public serviceSubscriptions: MyServiceSummary[] = [];
  public limitDefinitionsPerLimitName: LimitDefinitionsPerProperty<MyLimitDefinitionSummary> =
    new Map();
  public limitDefinitionsPerService: Map<string, MyLimitDefinitionSummary[]> =
    new Map();
  private availabilityDomainsPerRegion: Map<
    identity.models.RegionSubscription,
    MyAvailabilityDomain[]
  > = new Map();

  private constructor() {
    this.Ready = new Promise(async (resolve, _reject) => {
      const startupData = await getStartupData();
      this.compartments = startupData.compartments;
      this.regionSubscriptions = startupData.regionSubscriptions;
      this.serviceSubscriptions = startupData.serviceSubscriptions;
      this.limitDefinitionsPerLimitName =
        startupData.limitDefinitionsPerLimitName;
      this.limitDefinitionsPerService = startupData.limitDefinitionsPerService;
      this.availabilityDomainsPerRegion =
        startupData.availabilityDomainsPerRegion;
      resolve(undefined);
    });
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

  getAvailabilityDomains(
    region: identity.models.RegionSubscription
  ): MyAvailabilityDomain[] {
    return this.availabilityDomainsPerRegion.get(region) || [];
  }

  addUniqueLimit(uniqueLimit: UniqueLimit): void {
    if (uniqueLimit.resourceAvailability.length === 0) {
      log(
        path.basename(__filename),
        `Adding UniqueLimit with resourceAvailibility.length === 0
        into LimitSet is not advised, operation refused`
      );
      return;
    }

    if (this.hasUniqueLimit(uniqueLimit)) return;

    this.uniqueLimitCache.set(this.toLimitString(uniqueLimit), uniqueLimit);
  }

  hasRegion(region: identity.models.RegionSubscription) {
    return this.regionSubscriptions.find(
      (regionSubscription) => region === regionSubscription
    );
  }

  hasService(serviceName: string) {
    return this.serviceSubscriptions.some(
      (summary) => summary.name === serviceName
    );
  }

  hasUniqueLimit(item: UniqueLimit): UniqueLimit | undefined {
    return this.uniqueLimitCache.get(this.toLimitString(item));
  }

  clear(): void {
    this.uniqueLimitCache.clear();
  }
}

// Singleton
/* export class Cache {
  public readonly Ready: Promise<any>;
  private static instance: Cache;
  private uniqueLimitCache: Map<string, UniqueLimit>;
  public compartments: identity.models.Compartment[];
  public regionSubscriptions: identity.models.RegionSubscription[];
  public serviceSubscriptions: MyServiceSummary[];
  public limitDefinitionsPerLimitName: MyLimitDefinitionsPerProperty;
  public limitDefinitionsPerService: Map<string, MyLimitDefinitionSummary[]>;
  public serviceLimitMap: RegionToServiceMap;
  public readonly availabilityDomainsPerRegion: Map<
    identity.models.RegionSubscription,
    MyAvailabilityDomain[]
  >;
  public invalidationTimestamp: number;

  private constructor() {
    this.Ready = new Promise((resolve, reject) => {
      this.compartments =
    })
    this.uniqueLimitCache = new Map();
    this.compartments = [];
    this.regionSubscriptions = [];
    this.serviceSubscriptions = [];
    this.limitDefinitionsPerLimitName = new Map();
    this.limitDefinitionsPerService = new Map();
    this.serviceLimitMap = new Map();
    this.availabilityDomainsPerRegion = new Map();
    this.invalidationTimestamp = Date.now();
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

  hasRegion(region: identity.models.RegionSubscription) {
    return this.regionSubscriptions.find(
      (regionSubscription) => region === regionSubscription
    );
  }

  async setAvailabilityDomainsPerRegion(
    region: identity.models.RegionSubscription,
    availabilityDomains: identity.models.AvailabilityDomain[]
  ): Promise<void> {
    if (!this.hasRegion(region)) return;
    this.availabilityDomainsPerRegion.set(
      region,
      await filterAvailabilityDomains(availabilityDomains)
    );
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
    for (const serviceNameToServiceLimitsMap of this.serviceLimitMap.values()) {
      serviceNameToServiceLimitsMap.clear();
    }
  }
} */
