import { IdentityClient } from "oci-identity";
import type { common } from "oci-sdk";
import { Provider } from "../services/provider";

export const getIdentityClient = (
  clientConfiguration?: common.ClientConfiguration
): IdentityClient => {
  const identityClient = new IdentityClient(
    {
      authenticationDetailsProvider: Provider.getInstance().provider,
    },
    clientConfiguration
  );

  return identityClient;
};
