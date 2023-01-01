import {
  Names,
  UniqueLimit,
  ResponseTreeNode,
  MyLimitDefinitionSummary,
  IdentityCompartment,
  ResourceAvailabilityObject,
} from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import { getAvailabilityDomainsPerRegion } from "./getAvailabilityDomainsPerRegion";
import { getResourceAvailability } from "./getResourceAvailability";
import path from "path";
import type { common, identity, limits } from "oci-sdk";
import { Cache } from "./cache";
import { log } from "../utils/log";

const filePath = path.basename(__filename);

const addNode = (
  limitPath: string[],
  uniqueLimit: UniqueLimit,
  node: ResponseTreeNode
) => {
  if (limitPath.length === 0) {
    if (node.children.length !== 0)
      log(filePath, `pushing UniqueLimits into node.limits in a non leaf!`);

    if (!node.limits) {
      node["limits"] = [uniqueLimit];
    } else {
      node.limits.push(uniqueLimit);
    }
    return;
  }

  const currentStop = limitPath.pop()!;

  for (const child of node.children) {
    if (child.name === currentStop) {
      addNode(limitPath, uniqueLimit, child);
      return;
    }
  }

  const child: ResponseTreeNode = Object.create(null);
  child["name"] = currentStop;
  child.children = [];
  node.children.push(child);

  addNode(limitPath, uniqueLimit, child);
};

const loadResponseTree = (
  uniqueLimit: UniqueLimit,
  root: ResponseTreeNode,
  type: "compartment" | "service"
) => {
  // TODO: in case of global, remove '!'
  let limitPath =
    type === "compartment"
      ? [
          uniqueLimit.serviceName,
          uniqueLimit.scope,
          uniqueLimit.regionId!,
          uniqueLimit.compartmentName,
        ]
      : [
          uniqueLimit.scope,
          uniqueLimit.regionId!,
          uniqueLimit.compartmentName,
          uniqueLimit.serviceName,
        ];

  addNode(limitPath, uniqueLimit, root);
};

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
  rootCompartments: ResponseTreeNode,
  rootServices: ResponseTreeNode,
  serviceLimits: limits.models.LimitValueSummary[]
): Promise<void> => {
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
    loadResponseTree(limitSetUniqueLimit, rootCompartments, "compartment");
    loadResponseTree(limitSetUniqueLimit, rootServices, "service");
    return;
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

  cache.addLimit(newUniqueLimit);
  loadResponseTree(newUniqueLimit, rootCompartments, "compartment");
  loadResponseTree(newUniqueLimit, rootServices, "service");
  // outputToFile("test/getCompartmentsRegionResources.txt", logFormattedOutput);
};
