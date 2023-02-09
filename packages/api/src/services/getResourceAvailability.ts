import type { identity, limits } from "common";
import path from "path";
import { log } from "../utils/log";

const filePath = path.basename(__filename);

export const getResourceAvailability = async (
  limitsClient: limits.LimitsClient,
  compartmentId: string,
  limitDefinitionSummary: limits.models.LimitDefinitionSummary,
  availabilityDomain?: identity.models.AvailabilityDomain
): Promise<limits.models.ResourceAvailability | undefined> => {
  if (
    !limitDefinitionSummary.name ||
    (availabilityDomain !== undefined && !availabilityDomain.name) ||
    !limitDefinitionSummary.serviceName
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
        availabilityDomain: availabilityDomain.name!,
      }),
    };
  let resourceAvailability: limits.models.ResourceAvailability | undefined =
    undefined;
  try {
    const getResourceAvailabilityResponse =
      await limitsClient.getResourceAvailability(
        getResourceAvailabilityRequest
      );
    resourceAvailability = getResourceAvailabilityResponse.resourceAvailability;
  } catch (error) {
    log(
      filePath,
      `unable to getResourceAvailability for a ${limitDefinitionSummary}${
        availabilityDomain ? ` with an ${availabilityDomain}` : ""
      }`
    );
  }

  return resourceAvailability;
};
