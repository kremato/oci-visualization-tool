import { UniqueLimit } from "common";

export interface DropdownItem {
  primaryLabel: string;
  secondaryLabel: string;
  serviceName?: string;
}

export type ApiStatus = "ready" | "down" | "loading";

export type ApiDropdownDataEndpoints =
  | "compartments"
  | "region-subscriptions"
  | "services"
  | "limits";

export enum LimitsFormEntries {
  Compartments = "compartments",
  Regions = "regions",
  Services = "services",
  Limits = "limits",
  InvalidateCache = "invalidateCache",
}

export interface LimitsFormValues {
  [LimitsFormEntries.Compartments]: string[];
  [LimitsFormEntries.Regions]: string[];
  [LimitsFormEntries.Services]: string[];
  [LimitsFormEntries.Limits]: { limitName: string; serviceName: string }[];
  [LimitsFormEntries.InvalidateCache]: boolean;
}

export interface UniqueLimitTreeNode {
  name: string;
  children: UniqueLimitTreeNode[];
  limits?: UniqueLimit[];
}
