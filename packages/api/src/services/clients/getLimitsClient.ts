import { limits } from "common";
import { Provider } from "../provider";

export const getLimitsClient = (): limits.LimitsClient => {
  const limitsClient = new limits.LimitsClient({
    authenticationDetailsProvider: Provider.getInstance().provider,
  });
  return limitsClient;
};
