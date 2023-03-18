import {
  UniqueLimit,
  MyLimitDefinitionSummary,
  ResourceAvailabilityObject,
  identity,
  limits,
} from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import { getAvailabilityDomainsPerRegion } from "./getAvailabilityDomainsPerRegion";
import { getResourceAvailability } from "./getResourceAvailability";
import { Cache } from "./cache";
import type { MyLimitValueSummary } from "../types/types";

const maxValue = Number.MAX_SAFE_INTEGER;

const getResourceAvailibilityForUndefinedAndMaxValue = (
  property: number | undefined
) =>
  property !== undefined && property <= maxValue ? property.toString() : "n/a";

const getAvailabilityObject = async (
  compartmentId: string,
  limitDefinitionSummary: MyLimitDefinitionSummary,
  limitsClient: limits.LimitsClient,
  serviceLimits: MyLimitValueSummary[],
  availabilityDomain?: identity.models.AvailabilityDomain
): Promise<ResourceAvailabilityObject | undefined> => {
  const resourceAvailability = await getResourceAvailability(
    limitsClient,
    compartmentId,
    limitDefinitionSummary,
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

  const serviceLimit = serviceLimits.find(
    (limit) =>
      limit.availabilityDomain === availabilityDomain?.name &&
      limit.name === limitDefinitionSummary.name &&
      limit.scopeType === limitDefinitionSummary.scopeType
  );

  return {
    availabilityDomain: availabilityDomain ? availabilityDomain.name : "REGION",
    serviceLimit: getResourceAvailibilityForUndefinedAndMaxValue(
      serviceLimit?.value
    ),
    available,
    used,
    quota,
  };
};

export const loadUniqueLimit = async (
  compartment: identity.models.Compartment,
  region: identity.models.RegionSubscription,
  limitDefinitionSummary: MyLimitDefinitionSummary,
  serviceLimits: MyLimitValueSummary[]
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

  const limitSetUniqueLimit = cache.hasLimit(newUniqueLimit);
  // if limit is already present, skip fetching and just add the limit to the response
  if (limitSetUniqueLimit) {
    return limitSetUniqueLimit;
  }

  if (
    limitDefinitionSummary.scopeType ===
    limits.models.LimitDefinitionSummary.ScopeType.Ad
  ) {
    if (!cache.availabilityDomainsPerRegion.has(region))
      cache.availabilityDomainsPerRegion.set(
        region,
        await getAvailabilityDomainsPerRegion(region)
      );
    const availabilityDomains = cache.availabilityDomainsPerRegion.get(region)!;
    for (const availabilityDomain of availabilityDomains) {
      const availabilityObject = await getAvailabilityObject(
        compartment.id,
        limitDefinitionSummary,
        limitsClient,
        serviceLimits,
        availabilityDomain
      );

      if (availabilityObject) resourceAvailabilityList.push(availabilityObject);
    }
  }

  if (
    limitDefinitionSummary.scopeType ===
    limits.models.LimitDefinitionSummary.ScopeType.Region
  ) {
    const availabilityObject = await getAvailabilityObject(
      compartment.id,
      limitDefinitionSummary,
      limitsClient,
      serviceLimits
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
