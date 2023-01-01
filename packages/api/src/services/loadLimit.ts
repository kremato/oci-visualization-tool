import {
  Names,
  UniqueLimit,
  MyLimitDefinitionSummary,
  IdentityCompartment,
  ResourceAvailabilityObject,
} from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import { getAvailabilityDomainsPerRegion } from "./getAvailabilityDomainsPerRegion";
import { getResourceAvailability } from "./getResourceAvailability";
import type { common, identity, limits } from "oci-sdk";
import { Cache } from "./cache";

const getAvailabilityObject = async (
  compartmentId: string,
  limitDefinitionSummary: MyLimitDefinitionSummary,
  limitsClient: limits.LimitsClient,
  serviceLimits: limits.models.LimitValueSummary[],
  availabilityDomain?: identity.models.AvailabilityDomain
): Promise<ResourceAvailabilityObject | undefined> => {
  const resourceAvailability = await getResourceAvailability(
    limitsClient,
    compartmentId,
    limitDefinitionSummary,
    availabilityDomain
  );

  if (!resourceAvailability) return;

  const available = resourceAvailability.available?.toString() || "n/a";
  const used = resourceAvailability.used?.toString() || "n/a";
  const quota = resourceAvailability.effectiveQuotaValue?.toString() || "n/a";
  const serviceLimit = serviceLimits.find(
    (limit) =>
      limit.availabilityDomain === availabilityDomain?.name &&
      limit.name === limitDefinitionSummary.name
  );
  return {
    serviceLimit: serviceLimit?.value ? serviceLimit.value.toString() : "n/a",
    available,
    used,
    quota,
    /* availabilityDomain: availabilityDomain.name parameter is only added to the
      request object in case availabilityDomain is defined */
    ...(availabilityDomain && {
      availabilityDomain: availabilityDomain.name,
    }),
  };
};

export const loadLimit = async (
  compartment: IdentityCompartment,
  region: common.Region,
  limitDefinitionSummary: MyLimitDefinitionSummary,
  serviceLimits: limits.models.LimitValueSummary[]
): Promise<UniqueLimit> => {
  const limitsClient = getLimitsClient();
  limitsClient.region = region;
  const resourceAvailabilityList: {
    serviceLimit: string;
    available: string;
    used: string;
    quota: string;
    availabilityDomain?: string;
  }[] = [];
  const newUniqueLimit: UniqueLimit = {
    serviceName: limitDefinitionSummary.serviceName,
    compartmentId: compartment.id,
    scope: limitDefinitionSummary.scopeType,
    regionId: region.regionId,
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
    console.log("LOADED");
    return limitSetUniqueLimit;
  }

  console.log("FETCHING");

  if (limitDefinitionSummary.scopeType === Names.AD.toString()) {
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

  if (limitDefinitionSummary.scopeType === Names.Region.toUpperCase()) {
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
      limit.serviceLimit === "n/a" ? 0 : Number(limit.available);
    totalAvailable += limit.available === "n/a" ? 0 : Number(limit.available);
    totalUsed += limit.used === "n/a" ? 0 : Number(limit.used);
    totalQuota += limit.quota === "n/a" ? 0 : Number(limit.quota);
  }

  newUniqueLimit.resourceAvailabilitySum.serviceLimit =
    totalServiceLimit.toString();
  newUniqueLimit.resourceAvailabilitySum.available = totalAvailable.toString();
  newUniqueLimit.resourceAvailabilitySum.used = totalUsed.toString();
  newUniqueLimit.resourceAvailabilitySum.quota = totalQuota.toString();

  // outputToFile("test/getCompartmentsRegionResources.txt", logFormattedOutput);
  return newUniqueLimit;
};
