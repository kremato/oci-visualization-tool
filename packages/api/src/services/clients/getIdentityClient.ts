import { identity } from "common";
import { Provider } from "../provider";

export const getIdentityClient = (): identity.IdentityClient => {
  const identityClient = new identity.IdentityClient({
    authenticationDetailsProvider: Provider.getInstance().provider,
  });

  return identityClient;
};
