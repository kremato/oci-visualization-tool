import { IdentityClient } from "oci-identity";
import type { ConfigFileAuthenticationDetailsProvider } from "oci-common";

export const getIdentityClient = (
  provider: ConfigFileAuthenticationDetailsProvider
): IdentityClient => {
  const identityClient = new IdentityClient({
    authenticationDetailsProvider: provider,
  });

  return identityClient;
};
