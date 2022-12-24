import type { common, identity } from "oci-sdk";
import { getIdentityClient } from "../clients/getIdentityClient";
import { Provider } from "../clients/provider";

export const getAvailabilityDomainsPerRegion = async (
  region: common.Region,
  clientConfiguration?: common.ClientConfiguration
): Promise<identity.models.AvailabilityDomain[]> => {
  const identityClient = getIdentityClient(clientConfiguration);

  identityClient.region = region;
  const request: identity.requests.ListAvailabilityDomainsRequest = {
    compartmentId: Provider.getInstance().provider.getTenantId(),
  };
  const response = await identityClient.listAvailabilityDomains(request);
  return response.items;
};
