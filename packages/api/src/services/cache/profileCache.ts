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
} from "../../types/types";
import { log } from "../../utils/log";
import { getStartupData } from "../getStartupData";

// Singleton
export class ProfileCache {
  public readonly Ready: Promise<any>;
  private static instance: ProfileCache;
  private uniqueLimitCache: Map<string, UniqueLimit> = new Map();
  private compartments: identity.models.Compartment[] = [];
  private regionSubscriptions: identity.models.RegionSubscription[] = [];
  private services: MyServiceSummary[] = [];
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
      this.services = startupData.serviceSubscriptions;
      this.limitDefinitionsPerLimitName =
        startupData.limitDefinitionsPerLimitName;
      this.limitDefinitionsPerService = startupData.limitDefinitionsPerService;
      this.availabilityDomainsPerRegion =
        startupData.availabilityDomainsPerRegion;
      resolve(undefined);
    });
  }

  static getInstance(): ProfileCache {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProfileCache();
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
    return (
      structuredClone(this.availabilityDomainsPerRegion.get(regionId)) || []
    );
  }

  getCompartments(): identity.models.Compartment[] {
    return structuredClone(this.compartments);
  }

  getSubscribedRegions(): identity.models.RegionSubscription[] {
    return structuredClone(this.regionSubscriptions);
  }

  // returns a list of of limits grouped by limit name(each group has its own list)
  getLimitDefinitionsGroupedByLimitName() {
    return [...structuredClone(this.limitDefinitionsPerLimitName.values())];
  }

  getLimitDefinitionsPerService(
    serviceName: string
  ): MyLimitDefinitionSummary[] | undefined {
    return structuredClone(this.limitDefinitionsPerService.get(serviceName));
  }

  getServices(): MyServiceSummary[] {
    return structuredClone(this.services);
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
