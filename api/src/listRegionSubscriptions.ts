import { identity } from "oci-sdk";
import { getProvider } from "./clients/getProvider";

export const listRegionSubscriptions = async (tenancyId: string) => {
  const client = new identity.IdentityClient({
    authenticationDetailsProvider: getProvider(),
  });

  const listRegionSubscriptionsRequest: identity.requests.ListRegionSubscriptionsRequest =
    {
      tenancyId,
    };

  const listRegionSubscriptionsResponse = await client.listRegionSubscriptions(
    listRegionSubscriptionsRequest
  );

  return listRegionSubscriptionsResponse.items
};
