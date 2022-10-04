import type { ConfigFileAuthenticationDetailsProvider } from "oci-common";
import { ComputeClient } from "oci-core";

export const getComputeClient = (
  provider: ConfigFileAuthenticationDetailsProvider
): ComputeClient => {
  const computeClient = new ComputeClient({
    authenticationDetailsProvider: provider,
  });
  return computeClient;
};
