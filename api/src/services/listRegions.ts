import type { identity } from "oci-sdk";
import { getIdentityClient } from "../clients/getIdentityClient";
import { Provider } from "../clients/provider";

export const listRegions = async () => {
  const identityClient = getIdentityClient(Provider.getInstance().provider);

  // Create a request and dependent object(s).
  const listRegionsRequest: identity.requests.ListRegionsRequest = {};

  // Send request to the Client.
  const listRegionsResponse = await identityClient.listRegions(listRegionsRequest);

  return listRegionsResponse.items;
};
