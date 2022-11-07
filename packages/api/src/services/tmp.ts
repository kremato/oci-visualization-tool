import type { identity, limits } from "oci-sdk";

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
    console.debug(
      `Unable to create GetResourceAvailabilityRequest because either limitDefinitionSummary.name,
      limitDefinitionSummary.serviceName or availabilityDomain.name is undefined`
    );
    return;
  }

  let getResourceAvailabilityRequest: limits.requests.GetResourceAvailabilityRequest =
    {
      serviceName: limitDefinitionSummary.serviceName,
      limitName: limitDefinitionSummary.name,
      compartmentId,
      ...(availabilityDomain && {
        availabilityDomain: availabilityDomain.name!,
      }),
    };

  const getResourceAvailabilityResponse =
    await limitsClient.getResourceAvailability(getResourceAvailabilityRequest);

  return getResourceAvailabilityResponse.resourceAvailability;
};
