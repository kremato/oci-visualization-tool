import { common, identity } from "common";
import { Provider } from "../services/provider";

export const getIdentityClient = (
  clientConfiguration?: common.ClientConfiguration
): identity.IdentityClient => {
  const identityClient = new identity.IdentityClient(
    {
      authenticationDetailsProvider: Provider.getInstance().provider,
    },
    clientConfiguration
  );

  return identityClient;
};
