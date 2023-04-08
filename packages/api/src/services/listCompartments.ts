import { getCompartment } from "./getCompartment";
import type { identity } from "common";
import { getIdentityClient } from "./clients/getIdentityClient";
import { log } from "../utils/log";
import path from "path";
import { getProvider } from "./clients/getProvider";

export const listCompartments = async (
  profile: string
): Promise<identity.models.Compartment[]> => {
  const identityClient = getIdentityClient(profile);

  const tenancy = getProvider(profile).getTenantId();
  const listCompartmentsRequest: identity.requests.ListCompartmentsRequest = {
    compartmentId: tenancy,
    compartmentIdInSubtree: true,
  };

  let compartments: identity.models.Compartment[] = [];
  try {
    const response = await identityClient.listCompartments(
      listCompartmentsRequest
    );
    compartments = compartments.concat(response.items);
  } catch (error) {
    log(
      path.basename(__filename),
      "unable to fetch compartments through identityClient.listCompartments()"
    );
  }

  const tenancyCompartment = await getCompartment(tenancy, identityClient);

  if (tenancyCompartment) compartments.unshift(tenancyCompartment);

  return compartments;
};
