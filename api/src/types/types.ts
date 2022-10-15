import type { identity, limits } from "oci-sdk";

export type Compartment = identity.models.Compartment;
export type RegionSubscription = identity.models.RegionSubscription;
export type ServiceSummary = limits.models.ServiceSummary;

export type HierarchyMap = Map<string, Compartment[]>;
export type LimitDefinitionsMap = Map<
  string,
  limits.models.LimitDefinitionSummary[]
>;
export type LimitDefinitionsPerScope = Map<string, LimitDefinitionsMap>;
export type CheckboxHash = {
  compartments: { [id: string]: boolean };
  regions: { [id: string]: boolean };
  services: { [id: string]: boolean };
};
