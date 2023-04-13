import { identity } from "common";
import { getProvider } from "./getProvider";
import { Cache } from "../cache/cache";

export const getIdentityClient = (profile: string): identity.IdentityClient => {
  const provider = Cache.getProvider(profile) || getProvider(profile);
  const identityClient = new identity.IdentityClient({
    authenticationDetailsProvider: provider,
  });

  return identityClient;
};
