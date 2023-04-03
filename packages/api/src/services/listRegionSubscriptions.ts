import { identity } from "common";
import { Provider } from "./provider";

export const listRegionSubscriptions = async (): Promise<
  identity.models.RegionSubscription[]
> => {
  const client = new identity.IdentityClient({
    authenticationDetailsProvider: Provider.getInstance().provider,
  });

  const listRegionSubscriptionsRequest: identity.requests.ListRegionSubscriptionsRequest =
    {
      tenancyId: Provider.getInstance().provider.getTenantId(),
    };

  const listRegionSubscriptionsResponse = await client.listRegionSubscriptions(
    listRegionSubscriptionsRequest
  );

  return listRegionSubscriptionsResponse.items;
};
