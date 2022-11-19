import {
  Names,
  UniqueLimit,
  Nested,
  MyLimitDefinitionSummary,
  IdentityCompartment,
} from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import type { CommonRegion, Token } from "../types/types";
import { getAvailibilityDomainsPerRegion } from "./getAvailibilityDomainsPerRegion";
import { getResourceAvailability } from "./getResourceAvailibility";
import path from "path";
import type { identity, limits } from "oci-sdk";
import { LimitSet } from "./LimitSet";

const loadResponseChain = (
  limitPath: string[],
  uniqueLimit: UniqueLimit,
  nested: Nested
) => {
  if (limitPath.length === 0) {
    if (nested.children.length !== 0)
      console.log(
        `[${path.basename(__filename)}]:
         Pushing UniqueLimits into nested.limits in a non leaf!`
      );

    if (!nested.limits) {
      nested["limits"] = [uniqueLimit];
    } else {
      nested.limits.push(uniqueLimit);
    }
    return;
  }

  const currentStop = limitPath.pop()!;

  for (const child of nested.children) {
    if (child.name === currentStop) {
      loadResponseChain(limitPath, uniqueLimit, child);
      return;
    }
  }

  const child: Nested = Object.create(null);
  child["name"] = currentStop;
  child.children = [];
  nested.children.push(child);

  loadResponseChain(limitPath, uniqueLimit, child);
};

const getAvailibilityObject = async (
  compartmentId: string,
  limitDefinitionSummary: limits.models.LimitDefinitionSummary,
  limitsClient: limits.LimitsClient,
  availabilityDomain?: identity.models.AvailabilityDomain
) => {
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
  return { available, used, quota };
};

export const loadLimit = async (
  compartment: IdentityCompartment,
  region: CommonRegion,
  limitDefinitionSummary: MyLimitDefinitionSummary,
  initialPostLimitsCount: number,
  token: Token,
  nestedChainCompartments: Nested,
  nestedChainServices: Nested
): Promise<void> => {
  const limitsClient = getLimitsClient();
  limitsClient.region = region;
  const newRequest = token.postLimitsCount != initialPostLimitsCount + 1;
  const resourceAvailabilityList: {
    available: string;
    used: string;
    quota: string;
    availibilityDomain?: string;
  }[] = [];
  const uniqueLimit: UniqueLimit = {
    serviceName: limitDefinitionSummary.serviceName,
    compartmentId: compartment.id,
    scope: limitDefinitionSummary.scopeType,
    limitName: limitDefinitionSummary.name,
    resourceAvailibility: resourceAvailabilityList,
    regionId: region.regionId,
  };
  const limitSet = LimitSet.getInstance();

  // if limit is already present, skip fetching and just add the limit to the response
  if (!limitSet.has(uniqueLimit)) {
    console.log("FETCHING");
    if (limitDefinitionSummary.scopeType === Names.AD.toString()) {
      const availabilityDomains = await getAvailibilityDomainsPerRegion(region);
      for (const availabilityDomain of availabilityDomains) {
        if (newRequest) {
          console.log(
            `[${path.basename(__filename)}]: new request detected, aborting`
          );
          return;
        }
        const availibilityObject = await getAvailibilityObject(
          compartment.id,
          limitDefinitionSummary,
          limitsClient,
          availabilityDomain
        );
        if (availibilityObject)
          resourceAvailabilityList.push(availibilityObject);
      }
    }

    if (limitDefinitionSummary.scopeType === Names.Region.toUpperCase()) {
      if (newRequest) {
        console.log(
          `[${path.basename(__filename)}]: new request detected, aborting`
        );
        return;
      }
      const availibilityObject = await getAvailibilityObject(
        compartment.id,
        limitDefinitionSummary,
        limitsClient
      );
      if (availibilityObject) resourceAvailabilityList.push(availibilityObject);
    }
  }

  // TODO: in case of global, remove '!'
  limitSet.add(uniqueLimit);
  const pathCompartments = [
    uniqueLimit.serviceName,
    uniqueLimit.scope,
    uniqueLimit.regionId!,
    compartment.name,
  ];
  const pathServices = [
    uniqueLimit.scope,
    uniqueLimit.regionId!,
    compartment.name,
    uniqueLimit.serviceName,
  ];
  loadResponseChain(pathCompartments, uniqueLimit, nestedChainCompartments);
  loadResponseChain(pathServices, uniqueLimit, nestedChainServices);
  // outputToFile("test/getCompartmentsRegionResources.txt", logFormattedOutput);
};
