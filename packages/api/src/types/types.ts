import type { common, identity, limits } from "oci-sdk";

export type Compartment = identity.models.Compartment;
export type IdentityRegion = identity.models.Region;
export type CommonRegion = common.Region;
export type RegionSubscription = identity.models.RegionSubscription;
export type ServiceSummary = limits.models.ServiceSummary;

export type HierarchyMap = Map<string, Compartment[]>;
// Used to map limit property to limits with this property, for example
// limits with the same serviceName property
export type LimitDefinitionsMap = Map<
  string,
  limits.models.LimitDefinitionSummary[]
>;
// One level "above" the LimitDefinitionsMap, this groups together limits with
// the same property and scope together
export type LimitDefinitionsPerScope = Map<string, LimitDefinitionsMap>;

export type ResourceObjectAD = {
  resourceName: string | undefined;
  availibilityDomain: {
    name: string | undefined;
    available: string;
    used: string;
    quota: string;
  }[];
};
export type ResourceObjectRegion = {
  resourceName: string | undefined;
  available: string;
  used: string;
};

export type ServiceResourceMapAD = Map<string, ResourceObjectAD[]>;
export type ServiceResourceMapRegion = Map<
  string,
  ResourceObjectRegion[]
>;

export type RegionServicesObject = {
  aDScope: ServiceResourceMapAD;
  regionScope: ServiceResourceMapRegion;
};
export type RegionToScope = Map<CommonRegion, RegionServicesObject>;

export type CompartmentToRegions = Map<
  identity.models.Compartment,
  RegionToScope
>;

export type InputData = {
  compartments: string[];
  regions: string[];
  services: string[];
};

export type ServiceLimits = Map<CommonRegion, LimitDefinitionsPerScope>;
export type IdentityADSet = Set<identity.models.AvailabilityDomain>;
