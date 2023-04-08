import { identity } from "common";
import { getProvider } from "./getProvider";

export const getIdentityClient = (profile: string): identity.IdentityClient => {
  const identityClient = new identity.IdentityClient({
    authenticationDetailsProvider: getProvider(profile),
  });

  return identityClient;
};
