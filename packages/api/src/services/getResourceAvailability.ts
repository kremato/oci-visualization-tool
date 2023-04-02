import type { identity, limits } from "common";
import path from "path";
import { getLimitsClient } from "../clients/getLimitsClient";
import type { MyAvailabilityDomain } from "../types/types";
import { log } from "../utils/log";

const filePath = path.basename(__filename);

export const getResourceAvailability = async (
  compartmentId: string,
  limitDefinitionSummary: limits.models.LimitDefinitionSummary,
  regionId: string,
  availabilityDomain?: identity.models.AvailabilityDomain | MyAvailabilityDomain
): Promise<limits.models.ResourceAvailability | undefined> => {
  if (
    !limitDefinitionSummary.name ||
    !limitDefinitionSummary.serviceName ||
    (availabilityDomain !== undefined && availabilityDomain.name === undefined)
  ) {
    log(
      filePath,
      `unable to create GetResourceAvailabilityRequest because either limitDefinitionSummary.name,
      limitDefinitionSummary.serviceName or availabilityDomain.name is undefined`
    );
    return;
  }

  let getResourceAvailabilityRequest: limits.requests.GetResourceAvailabilityRequest =
    {
      serviceName: limitDefinitionSummary.serviceName,
      limitName: limitDefinitionSummary.name,
      compartmentId,
      /* availabilityDomain: availabilityDomain.name parameter is only added to the
       request object in case availabilityDomain is defined */
      ...(availabilityDomain && {
        availabilityDomain: availabilityDomain.name,
      }),
    };
  let resourceAvailability: limits.models.ResourceAvailability | undefined =
    undefined;
  const limitsClient = getLimitsClient();
  limitsClient.regionId = regionId;
  try {
    const getResourceAvailabilityResponse =
      await limitsClient.getResourceAvailability(
        getResourceAvailabilityRequest
      );
    resourceAvailability = getResourceAvailabilityResponse.resourceAvailability;
  } catch (error) {
    log(
      filePath,
      `unable to getResourceAvailability for ${
        limitDefinitionSummary.name
      } limit in a ${limitDefinitionSummary.serviceName} service${
        availabilityDomain ? `, within ${availabilityDomain.name}` : ""
      }`
    );
  }

  return resourceAvailability;
};
