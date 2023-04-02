import {
  UniqueLimit,
  MyLimitDefinitionSummary,
  identity,
  limits,
} from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import { calculateResourceSum } from "../utils/calculateResourceSum";
import { createUniqueLimit } from "../utils/createUniqueLimit";
import { Cache } from "./cache";
import { getResourceObject } from "./getResourceObject";

export const loadUniqueLimit = async (
  compartment: identity.models.Compartment,
  regionId: string,
  limitDefinitionSummary: MyLimitDefinitionSummary
): Promise<UniqueLimit> => {
  const limitsClient = getLimitsClient();
  limitsClient.regionId = regionId;
  const newUniqueLimit: UniqueLimit = createUniqueLimit(
    compartment,
    limitDefinitionSummary,
    regionId
  );

  const cache = Cache.getInstance();

  // if limit is already present, skip fetching and just add the limit to the response
  const cachedUniqueLimit = cache.hasUniqueLimit(newUniqueLimit);
  if (cachedUniqueLimit) {
    return cachedUniqueLimit;
  }

  const resources = newUniqueLimit.resources;
  if (
    limitDefinitionSummary.scopeType ===
    limits.models.LimitDefinitionSummary.ScopeType.Ad
  ) {
    const availabilityDomains = cache.getAvailabilityDomains(regionId);
    for (const availabilityDomain of availabilityDomains) {
      const resourceObject = await getResourceObject(
        compartment.id,
        limitDefinitionSummary,
        regionId,
        availabilityDomain
      );

      if (resourceObject) {
        resources.push(resourceObject);
      }
    }
  }

  if (
    limitDefinitionSummary.scopeType ===
    limits.models.LimitDefinitionSummary.ScopeType.Region
  ) {
    const resourceObject = await getResourceObject(
      compartment.id,
      limitDefinitionSummary,
      regionId
    );

    if (resourceObject) resources.push(resourceObject);
  }

  calculateResourceSum(newUniqueLimit);

  return newUniqueLimit;
};
