import { IdentityClient } from "oci-identity";
import type { ConfigFileAuthenticationDetailsProvider } from "oci-common";
import type { common } from "oci-sdk";
import { Provider } from "./provider";

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
