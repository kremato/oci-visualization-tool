import { LimitsClient } from "oci-limits";
import type { ConfigFileAuthenticationDetailsProvider } from "oci-common";

export const getLimitsClient = (
  provider: ConfigFileAuthenticationDetailsProvider
): LimitsClient => {
  const limitsClient = new LimitsClient({
    authenticationDetailsProvider: provider,
  });
  return limitsClient;
};
