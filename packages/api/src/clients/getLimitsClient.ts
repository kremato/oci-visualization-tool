import { LimitsClient } from "oci-limits";
import { Provider } from "./provider";

export const getLimitsClient = (): LimitsClient => {
  const limitsClient = new LimitsClient({
    authenticationDetailsProvider: Provider.getInstance().provider,
  });
  return limitsClient;
};
