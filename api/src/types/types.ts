import type { identity, limits } from "oci-sdk";

export type Compartment = identity.models.Compartment;
export type Region = identity.models.Region;
export type HierarchyMap = Map<string, Compartment[]>;
export type LimitDefinitionsMap = Map<
  string,
  limits.models.LimitDefinitionSummary[]
>;
export type LimitDefinitionsPerScope = Map<string, LimitDefinitionsMap>;
