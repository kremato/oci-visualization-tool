export interface DropdownItem {
  primaryLabel: string;
  secondaryLabel: string;
  serviceName?: string;
}

export enum Names {
  Global = "global",
  Region = "region",
  AD = "AD",
  Compartment = "compartment",
  Service = "service",
  Scope = "scope",
  Limit = "limit",
}

export type ApiStatus = "up" | "down" | "loading";

export type ApiDropdownDataEndpoints =
  | "compartments"
  | "region-subscriptions"
  | "services"
  | "limits";
