import type { identity } from "common";
import path from "path";
import { getIdentityClient } from "./clients/getIdentityClient";
import { log } from "../utils/log";
import { Provider } from "./provider";

export const getAvailabilityDomainsPerRegion = async (
  region: identity.models.RegionSubscription
): Promise<identity.models.AvailabilityDomain[]> => {
  const identityClient = getIdentityClient();

  identityClient.regionId = region.regionName;
  const request: identity.requests.ListAvailabilityDomainsRequest = {
    compartmentId: Provider.getInstance().provider.getTenantId(),
  };

  let availibilityDomains: identity.models.AvailabilityDomain[] = [];
  try {
    const response = await identityClient.listAvailabilityDomains(request);
    availibilityDomains = response.items;
  } catch (error) {
    log(
      path.basename(__filename),
      `unable to fetch availibilityDomains for a region with the ID of ${region.regionName}`
    );
  }
  return availibilityDomains;
};
