import {
  UniqueLimit,
  MyLimitDefinitionSummary,
  ResourceAvailabilityObject,
  identity,
  limits,
} from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import { getResourceAvailability } from "./getResourceAvailability";
import { Cache } from "./cache";
import type { MyAvailabilityDomain, MyLimitValueSummary } from "../types/types";
import { listServiceLimits } from "./listServiceLimits";

const maxValue = Number.MAX_SAFE_INTEGER;

const getResourceAvailibilityForUndefinedAndMaxValue = (
  property: number | undefined
) =>
  property !== undefined && property <= maxValue ? property.toString() : "n/a";

const getResourceObject = async (
  compartmentId: string,
  limitDefinitionSummary: MyLimitDefinitionSummary,
  region: identity.models.RegionSubscription,
  availabilityDomain?: identity.models.AvailabilityDomain | MyAvailabilityDomain
): Promise<ResourceAvailabilityObject | undefined> => {
  const resourceAvailability = await getResourceAvailability(
    compartmentId,
    limitDefinitionSummary,
    region,
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

  let serviceLimits: MyLimitValueSummary[] = (await listServiceLimits(
    limitDefinitionSummary.serviceName,
    limitDefinitionSummary.name,
    region
  )) as MyLimitValueSummary[];

  const summary = serviceLimits.find(
    (summary) =>
      summary.availabilityDomain === availabilityDomain &&
      summary.name === limitDefinitionSummary.scopeType &&
      summary.name === limitDefinitionSummary.name
  );
  const serviceLimit = getResourceAvailibilityForUndefinedAndMaxValue(
    summary?.value
  );
  return {
    availabilityDomain: availabilityDomain ? availabilityDomain.name : "REGION",
    serviceLimit,
    available,
    used,
    quota,
  };
};

export const loadUniqueLimit = async (
  compartment: identity.models.Compartment,
  region: identity.models.RegionSubscription,
  limitDefinitionSummary: MyLimitDefinitionSummary
): Promise<UniqueLimit> => {
  const limitsClient = getLimitsClient();
  limitsClient.regionId = region.regionName;
  const resourceAvailabilityList: ResourceAvailabilityObject[] = [];
  const newUniqueLimit: UniqueLimit = {
    serviceName: limitDefinitionSummary.serviceName,
    compartmentId: compartment.id,
    scope: limitDefinitionSummary.scopeType,
    regionId: region.regionName,
    limitName: limitDefinitionSummary.name,
    compartmentName: compartment.name,
    resourceAvailability: resourceAvailabilityList,
    resourceAvailabilitySum: Object.create(null),
  };

  if (limitDefinitionSummary.isDeprecated !== undefined)
    newUniqueLimit.isDeprecated = limitDefinitionSummary.isDeprecated;

  const cache = Cache.getInstance();

  const cachedUniqueLimit = cache.hasUniqueLimit(newUniqueLimit);
  // if limit is already present, skip fetching and just add the limit to the response
  if (cachedUniqueLimit) {
    return cachedUniqueLimit;
  }

  if (
    limitDefinitionSummary.scopeType ===
    limits.models.LimitDefinitionSummary.ScopeType.Ad
  ) {
    const availabilityDomains = cache.getAvailabilityDomains(region);
    for (const availabilityDomain of availabilityDomains) {
      const availabilityObject = await getResourceObject(
        compartment.id,
        limitDefinitionSummary,
        region,
        availabilityDomain
      );

      if (availabilityObject) {
        resourceAvailabilityList.push(availabilityObject);
      }
    }
  }

  if (
    limitDefinitionSummary.scopeType ===
    limits.models.LimitDefinitionSummary.ScopeType.Region
  ) {
    const availabilityObject = await getResourceObject(
      compartment.id,
      limitDefinitionSummary,
      region
    );

    if (availabilityObject) resourceAvailabilityList.push(availabilityObject);
  }

  let totalServiceLimit = 0;
  let totalAvailable = 0;
  let totalUsed = 0;
  let totalQuota = 0;
  for (const limit of newUniqueLimit.resourceAvailability) {
    totalServiceLimit +=
      limit.serviceLimit === "n/a" ? 0 : Number(limit.serviceLimit);
    totalAvailable += limit.available === "n/a" ? 0 : Number(limit.available);
    totalUsed += limit.used === "n/a" ? 0 : Number(limit.used);
    totalQuota += limit.quota === "n/a" ? 0 : Number(limit.quota);
  }
  newUniqueLimit.resourceAvailabilitySum.availabilityDomain =
    newUniqueLimit.scope === limits.models.LimitDefinitionSummary.ScopeType.Ad
      ? "SUM"
      : "REGION";
  newUniqueLimit.resourceAvailabilitySum.serviceLimit =
    totalServiceLimit.toString();
  newUniqueLimit.resourceAvailabilitySum.available = totalAvailable.toString();
  newUniqueLimit.resourceAvailabilitySum.used = totalUsed.toString();
  newUniqueLimit.resourceAvailabilitySum.quota = totalQuota.toString();

  return newUniqueLimit;
};
