import { identity } from "common";
import { getProvider } from "./clients/getProvider";
import { Cache } from "./cache/cache";

export const listRegionSubscriptions = async (
  profile: string
): Promise<identity.models.RegionSubscription[]> => {
  const authenticationDetailsProvider =
    Cache.getProvider(profile) || getProvider(profile);
  const client = new identity.IdentityClient({
    authenticationDetailsProvider,
  });

  const listRegionSubscriptionsRequest: identity.requests.ListRegionSubscriptionsRequest =
    {
      tenancyId: authenticationDetailsProvider.getTenantId(),
    };

  const listRegionSubscriptionsResponse = await client.listRegionSubscriptions(
    listRegionSubscriptionsRequest
  );

  return listRegionSubscriptionsResponse.items;
};
