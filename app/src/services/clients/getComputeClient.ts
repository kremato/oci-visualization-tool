import type { ConfigFileAuthenticationDetailsProvider } from "oci-common";
import { ComputeClient } from "oci-core";
import { SimpleAuthenticationDetailsProvider } from "oci-sdk";

export const getComputeClient = (
  provider: SimpleAuthenticationDetailsProvider
): ComputeClient => {
  const computeClient = new ComputeClient({
    authenticationDetailsProvider: provider,
  });
  return computeClient;
};
