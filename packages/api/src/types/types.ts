import type { common, identity, limits } from "oci-sdk";
import { string } from "yup";

export type IdentityCompartment = identity.models.Compartment;
export type IdentityRegion = identity.models.Region;
export type CommonRegion = common.Region;
export type RegionSubscription = identity.models.RegionSubscription;
export type ServiceSummary = Omit<limits.models.ServiceSummary, "name"> & {
  name: string;
};
export type HierarchyMap = Map<string, IdentityCompartment[]>;
// Used to map limit property to limits with this property, for example
// limits with the same serviceName property
export type LimitDefinitionsMap = Map<
  string,
  limits.models.LimitDefinitionSummary[]
>;
// One level "above" the LimitDefinitionsMap, this groups together limits with
// the same property and scope together
export interface StringHash<Value> {
  [id: string]: Value;
}
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
// export type ServiceResourceHashAD = Map<string, ResourceObjectAD[]>;
export type ServiceResourceHashAD = StringHash<ResourceObjectAD[]>;
// export type ServiceResourceHashRegion = Map<string, ResourceObjectRegion[]>;
export type ServiceResourceHashRegion = {
  [id: string]: ResourceObjectRegion[];
};
export type ServiceScopeObject = {
  aDScope: ServiceResourceHashAD;
  regionScope: ServiceResourceHashRegion;
};
// export type RegionToScope = Map<CommonRegion, RegionServicesObject>;
export type CompartmentData = {
  compartmentName: string;
  regions: StringHash<ServiceScopeObject>;
};
export type CompartmentsHash = StringHash<CompartmentData>;
export type InputData = {
  compartments: string[];
  regions: string[];
  services: string[];
};
export type ServiceLimits = Map<CommonRegion, LimitDefinitionsPerScope>;
export type IdentityADSet = Set<identity.models.AvailabilityDomain>;
