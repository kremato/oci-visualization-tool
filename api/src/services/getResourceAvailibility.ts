import type { identity, limits } from 'oci-sdk'

export const getResourceAvailability = async (
  limitsClient: limits.LimitsClient,
  compartmentId: string,
  availabilityDomain: identity.models.AvailabilityDomain,
  limitDefinitionSummary: limits.models.LimitDefinitionSummary
): Promise<limits.models.ResourceAvailability | undefined> => {
  if (
    !limitDefinitionSummary.name ||
    !availabilityDomain.name ||
    !limitDefinitionSummary.serviceName
  ) {
    console.debug(
      `Unable to create GetResourceAvailabilityRequest because either limitDefinitionSummary.name,
      limitDefinitionSummary.serviceName or availabilityDomain.name is undefined`
    );
    return;
  }

  const getResourceAvailabilityRequest: limits.requests.GetResourceAvailabilityRequest =
    {
      serviceName: limitDefinitionSummary.serviceName,
      limitName: limitDefinitionSummary.name,
      compartmentId,
      availabilityDomain: availabilityDomain.name,
    };

  const getResourceAvailabilityResponse =
    await limitsClient.getResourceAvailability(getResourceAvailabilityRequest);

  return getResourceAvailabilityResponse.resourceAvailability;
};
