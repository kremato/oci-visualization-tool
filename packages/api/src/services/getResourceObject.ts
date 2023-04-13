import {
  MyLimitDefinitionSummary,
  identity,
  ResourceObject,
  limits,
} from "common";
import type { MyAvailabilityDomain } from "../types/types";
import { getResourceAvailability } from "./getResourceAvailability";
import { listServiceLimits } from "./listServiceLimits";

const maxValue = Number.MAX_SAFE_INTEGER;

const getResourceAvailibilityForUndefinedAndMaxValue = (
  property: number | undefined
) =>
  property !== undefined && property <= maxValue ? property.toString() : "n/a";

export const getResourceObject = async (
  profile: string,
  compartmentId: string,
  limitDefinitionSummary: MyLimitDefinitionSummary,
  regionId: string,
  availabilityDomain?: identity.models.AvailabilityDomain | MyAvailabilityDomain
): Promise<ResourceObject | undefined> => {
  const resourceAvailability = await getResourceAvailability(
    profile,
    compartmentId,
    limitDefinitionSummary,
    regionId,
    availabilityDomain
  );

  if (!resourceAvailability) return;

  const available = getResourceAvailibilityForUndefinedAndMaxValue(
    resourceAvailability.available
  );
  const used = getResourceAvailibilityForUndefinedAndMaxValue(
    resourceAvailability.used
  );
  const quota = getResourceAvailibilityForUndefinedAndMaxValue(
    resourceAvailability.effectiveQuotaValue
  );

  const scopeType =
    limitDefinitionSummary.scopeType === "AD"
      ? limits.requests.ListLimitValuesRequest.ScopeType.Ad
      : limits.requests.ListLimitValuesRequest.ScopeType.Region;
  let serviceLimits = await listServiceLimits(
    profile,
    limitDefinitionSummary.serviceName,
    limitDefinitionSummary.name,
    regionId,
    scopeType
  );

  const summary = serviceLimits.find(
    (summary) =>
      summary.availabilityDomain === availabilityDomain?.name &&
      summary.scopeType === limitDefinitionSummary.scopeType &&
      summary.name === limitDefinitionSummary.name
  );
  const serviceLimit = getResourceAvailibilityForUndefinedAndMaxValue(
    summary?.value
  );
  return {
    scope:
      limitDefinitionSummary.scopeType ===
      limits.models.LimitDefinitionSummary.ScopeType.Ad
        ? availabilityDomain?.name
        : regionId,
    serviceLimit,
    available,
    used,
    quota,
  };
};
