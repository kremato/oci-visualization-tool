import {
  UniqueLimit,
  MyLimitDefinitionSummary,
  identity,
  limits,
} from "common";
import { calculateResourceSum } from "../utils/calculateResourceSum";
import { createUniqueLimitObject } from "../utils/createUniqueLimitObject";
import type { ProfileCache } from "./cache/profileCache";
import { getResourceObject } from "./getResourceObject";

export const loadUniqueLimit = async (
  profileCache: ProfileCache,
  compartment: identity.models.Compartment,
  regionId: string,
  limitDefinitionSummary: MyLimitDefinitionSummary
): Promise<UniqueLimit> => {
  const newUniqueLimit: UniqueLimit = createUniqueLimitObject(
    compartment,
    limitDefinitionSummary,
    regionId
  );

  // if limit is already present, skip fetching and just add the limit to the response
  const cachedUniqueLimit = profileCache.hasUniqueLimit(newUniqueLimit);
  if (cachedUniqueLimit) {
    return cachedUniqueLimit;
  }

  const resources = newUniqueLimit.resources;
  if (
    limitDefinitionSummary.scopeType ===
    limits.models.LimitDefinitionSummary.ScopeType.Ad
  ) {
    const availabilityDomains = profileCache.getAvailabilityDomains(regionId);
    for (const availabilityDomain of availabilityDomains) {
      const resourceObject = await getResourceObject(
        profileCache.profile,
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
      profileCache.profile,
      compartment.id,
      limitDefinitionSummary,
      regionId
    );

    if (resourceObject) resources.push(resourceObject);
  }

  calculateResourceSum(newUniqueLimit);

  return newUniqueLimit;
};
