import { limits } from "common";
import { getProvider } from "./getProvider";
import { Cache } from "../cache/cache";

export const getLimitsClient = (profile: string): limits.LimitsClient => {
  const limitsClient = new limits.LimitsClient({
    authenticationDetailsProvider:
      Cache.getProvider(profile) || getProvider(profile),
  });
  return limitsClient;
};
