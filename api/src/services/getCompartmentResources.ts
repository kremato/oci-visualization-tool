import { getIdentityClient } from "../clients/getIdentityClient";
import { getLimitsClient } from "../clients/getLimitsClient";
import { Provider } from "../clients/provider";
import type { CommonRegion, Compartment } from "../types/types";

export const getCompartmentResources = (
  compartment: Compartment,
  region: CommonRegion
) => {
  const identityClient = getIdentityClient(Provider.getInstance().provider);
  const limitsClient = getLimitsClient();
  limitsClient.region = region;

  
};
