import type { Region } from "oci-common";
import type { identity } from "oci-sdk";
import { getIdentityClient } from "../clients/getIdentityClient";
import { Provider } from "../clients/provider";
import type { CommonRegion, IdentityADSet } from "../types/types";

export const getAvailibilityDomainsPerRegion = async (
  region: CommonRegion
): Promise<IdentityADSet> => {
  const identityClient = getIdentityClient(Provider.getInstance().provider);
  identityClient.region = region;
  const request: identity.requests.ListAvailabilityDomainsRequest = {
    compartmentId: Provider.getInstance().provider.getTenantId(),
  };
  const response = await identityClient.listAvailabilityDomains(request);
  const domainSet = new Set<identity.models.AvailabilityDomain>(response.items);
  return domainSet;
};
