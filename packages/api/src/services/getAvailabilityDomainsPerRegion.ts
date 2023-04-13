import type { identity } from "common";
import path from "path";
import { getIdentityClient } from "./clients/getIdentityClient";
import { log } from "../utils/log";
import { getProvider } from "./clients/getProvider";
import { Cache } from "./cache/cache";

export const getAvailabilityDomainsPerRegion = async (
  profile: string,
  region: identity.models.RegionSubscription
): Promise<identity.models.AvailabilityDomain[]> => {
  const identityClient = getIdentityClient(profile);

  identityClient.regionId = region.regionName;
  const request: identity.requests.ListAvailabilityDomainsRequest = {
    compartmentId: (
      Cache.getProvider(profile) || getProvider(profile)
    ).getTenantId(),
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
