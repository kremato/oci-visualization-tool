import { common, limits } from "common";
import { Provider } from "../services/provider";

export const getLimitsClient = (
  clientConfiguration?: common.ClientConfiguration
): limits.LimitsClient => {
  const limitsClient = new limits.LimitsClient(
    {
      authenticationDetailsProvider: Provider.getInstance().provider,
    },
    clientConfiguration
  );
  return limitsClient;
};
