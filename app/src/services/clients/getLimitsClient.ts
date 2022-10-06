import { LimitsClient } from "oci-limits";
import type { ConfigFileAuthenticationDetailsProvider } from "oci-common";
import { SimpleAuthenticationDetailsProvider } from "oci-sdk";

export const getLimitsClient = (
  provider:
    SimpleAuthenticationDetailsProvider
): LimitsClient => {
  const limitsClient = new LimitsClient({
    authenticationDetailsProvider: provider,
  });
  return limitsClient;
};
