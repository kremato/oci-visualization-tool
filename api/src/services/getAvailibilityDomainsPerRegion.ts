import type { Region } from "oci-common";
import type { identity } from "oci-sdk";
import { Provider } from "../clients/provider";
import type { IdentityADSet } from "../types/types";

/* Expects that region on identityClient is already set */
export const getAvailibilityDomainsPerRegion = async (
  identityClient: identity.IdentityClient
): Promise<IdentityADSet> => {
  const request: identity.requests.ListAvailabilityDomainsRequest = {
    compartmentId: Provider.getInstance().provider.getTenantId(),
  };
  const response = await identityClient.listAvailabilityDomains(request);
  const domainSet = new Set<identity.models.AvailabilityDomain>(response.items);
  return domainSet;
};
