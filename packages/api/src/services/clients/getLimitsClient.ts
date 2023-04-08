import { limits } from "common";
import { getProvider } from "./getProvider";

export const getLimitsClient = (profile: string): limits.LimitsClient => {
  const limitsClient = new limits.LimitsClient({
    authenticationDetailsProvider: getProvider(profile),
  });
  return limitsClient;
};
