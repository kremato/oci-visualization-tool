import { IdentityClient } from "oci-identity";
import type { ConfigFileAuthenticationDetailsProvider } from "oci-common";
import { SimpleAuthenticationDetailsProvider } from "oci-sdk";

export const getIdentityClient = (
  provider: SimpleAuthenticationDetailsProvider
): IdentityClient => {
  const identityClient = new IdentityClient({
    authenticationDetailsProvider: provider,
  });

  return identityClient;
};
