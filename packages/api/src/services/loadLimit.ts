import {
  ScopeObject,
  ResourceDataAD,
  ResourceDataRegion,
  StringHash,
  Names,
  ResourceDataGlobal,
  UniqueLimit,
  Nested,
} from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import type {
  CommonRegion,
  LimitDefinitionsPerScope,
  Token,
} from "../types/types";
import { getAvailibilityDomainsPerRegion } from "./getAvailibilityDomainsPerRegion";
import { getResourceAvailability } from "./getResourceAvailibility";
import { outputToFile } from "../utils/outputToFile";
import path from "path";
import { Provider } from "../clients/provider";
import type { identity, limits } from "oci-sdk";
import { LimitSet } from "./LimitSet";

const loadResponseChain = (
  path: string[],
  uniqueLimit: UniqueLimit,
  nested: Nested
) => {
  if (path.length === 0) {
    if (!nested.limits) {
      nested["limits"] = [uniqueLimit];
    } else {
      nested.limits.push(uniqueLimit);
    }
    return;
  }

  const currentStop = path.pop()!;

  for (const child of nested.children) {
    if (child.name === currentStop) {
      loadResponseChain(path, uniqueLimit, child);
      return;
    }
  }

  const child = Object.create(null);
  child["name"] = currentStop;
  child.isRoot = false;
  child.children = [];

  loadResponseChain(path, uniqueLimit, child);
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
  compartmentId: string,
  region: CommonRegion,
  limitDefinitionSummary: limits.models.LimitDefinitionSummary,
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
    serviceName: limitDefinitionSummary.serviceName!,
    compartmendId: compartmentId,
    scope: limitDefinitionSummary.scopeType!,
    limitName: limitDefinitionSummary.name!,
    resourceAvailibility: resourceAvailabilityList,
  };
  const limitSet = LimitSet.getInstance();

  if (limitSet.has(uniqueLimit)) return;

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
        compartmentId,
        limitDefinitionSummary,
        limitsClient,
        availabilityDomain
      );
      if (availibilityObject) resourceAvailabilityList.push(availibilityObject);
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
      compartmentId,
      limitDefinitionSummary,
      limitsClient
    );
    if (availibilityObject) resourceAvailabilityList.push(availibilityObject);
  }

  limitSet.add(uniqueLimit);
  const pathCompartments = [
    uniqueLimit.serviceName,
    uniqueLimit.scope,
    uniqueLimit.regionId!,
    uniqueLimit.compartmendId,
  ];
  const pathServices = [
    uniqueLimit.scope,
    uniqueLimit.regionId!,
    uniqueLimit.compartmendId,
    uniqueLimit.serviceName,
  ];
  loadResponseChain(pathCompartments, uniqueLimit, nestedChainCompartments);
  loadResponseChain(pathServices, uniqueLimit, nestedChainServices);
  // outputToFile("test/getCompartmentsRegionResources.txt", logFormattedOutput);
};
