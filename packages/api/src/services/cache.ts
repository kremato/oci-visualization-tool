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
  private uniqueLimitCache: Map<string, UniqueLimit> = new Map();
  private compartments: identity.models.Compartment[] = [];
  private regionSubscriptions: identity.models.RegionSubscription[] = [];
  private serviceSubscriptions: MyServiceSummary[] = [];
  private limitDefinitionsPerLimitName: LimitDefinitionsPerProperty<MyLimitDefinitionSummary> =
    new Map();
  private limitDefinitionsPerService: Map<string, MyLimitDefinitionSummary[]> =
    new Map();
  private availabilityDomainsPerRegion: Map<string, MyAvailabilityDomain[]> =
    new Map();

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
    ${uniqueLimit.limitName}
    ${uniqueLimit.serviceName}
    ${uniqueLimit.compartmentId}
    ${uniqueLimit.scope}
    ${uniqueLimit.regionId}
    `;
  }

  getAvailabilityDomains(regionId: string): MyAvailabilityDomain[] {
    return this.availabilityDomainsPerRegion.get(regionId) || [];
  }

  getCompartments(): identity.models.Compartment[] {
    return structuredClone(this.compartments);
  }

  getRegions(): identity.models.RegionSubscription[] {
    return structuredClone(this.regionSubscriptions);
  }

  // returns a list of of limits grouped by limit name(each group has its own list)
  getLimitDefinitionsGroupedByLimitName() {
    return [...structuredClone(this.limitDefinitionsPerLimitName.values())];
  }

  getLimitDefinitionsPerLimitName(
    limitName: string
  ): MyLimitDefinitionSummary[] | undefined {
    return structuredClone(this.limitDefinitionsPerLimitName.get(limitName));
  }

  getLimitDefinitionsPerService(
    serviceName: string
  ): MyLimitDefinitionSummary[] | undefined {
    return structuredClone(this.limitDefinitionsPerService.get(serviceName));
  }

  getServices(): MyServiceSummary[] {
    return structuredClone(this.serviceSubscriptions);
  }

  addUniqueLimit(uniqueLimit: UniqueLimit): void {
    if (uniqueLimit.resources.length === 0) {
      log(
        path.basename(__filename),
        `Adding UniqueLimit with no resources into cache is not advised, operation refused.
        ${this.toLimitString(uniqueLimit)}`
      );
      return;
    }

    if (this.hasUniqueLimit(uniqueLimit)) return;

    this.uniqueLimitCache.set(
      this.toLimitString(uniqueLimit),
      structuredClone(uniqueLimit)
    );
  }

  hasUniqueLimit(item: UniqueLimit): UniqueLimit | undefined {
    return structuredClone(this.uniqueLimitCache.get(this.toLimitString(item)));
  }

  clear(): void {
    this.uniqueLimitCache.clear();
  }
}
