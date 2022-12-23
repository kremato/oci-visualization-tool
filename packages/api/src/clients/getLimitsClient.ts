import { LimitsClient } from "oci-limits";
import type { common } from "oci-sdk";
import { Provider } from "./provider";

export const getLimitsClient = (
  clientConfiguration?: common.ClientConfiguration
): LimitsClient => {
  const limitsClient = new LimitsClient(
    {
      authenticationDetailsProvider: Provider.getInstance().provider,
    },
    clientConfiguration
  );
  return limitsClient;
};
