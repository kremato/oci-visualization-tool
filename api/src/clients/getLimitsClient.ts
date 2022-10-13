import { LimitsClient } from "oci-limits";
import { Provider } from "./clients";

export const getLimitsClient = (): LimitsClient => {
  const limitsClient = new LimitsClient({
    authenticationDetailsProvider: Provider.getInstance().provider,
  });
  return limitsClient;
};
