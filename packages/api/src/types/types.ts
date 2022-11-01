import type { CommonRegion } from "common";
import type { identity, limits } from "oci-sdk";

export type LimitDefinitionsMap = Map<
  string,
  limits.models.LimitDefinitionSummary[]
>;
export type LimitDefinitionsPerScope = Map<string, LimitDefinitionsMap>;
export type InputData = {
  compartments: string[];
  regions: string[];
  services: string[];
};
export type ServiceLimits = Map<CommonRegion, LimitDefinitionsPerScope>;
export type IdentityADSet = Set<identity.models.AvailabilityDomain>;
