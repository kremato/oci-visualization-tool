import { getCompartment } from "./getCompartment";
import type { identity } from "common";
import { getIdentityClient } from "../clients/getIdentityClient";
import { Provider } from "./provider";
import { log } from "../utils/log";
import path from "path";

export const listCompartments = async (): Promise<
  identity.models.Compartment[]
> => {
  const identityClient = getIdentityClient();

  const listCompartmentsRequest: identity.requests.ListCompartmentsRequest = {
    compartmentId: Provider.getInstance().provider.getTenantId(),
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

  const tenancyCompartment = await getCompartment(
    Provider.getInstance().provider.getTenantId(),
    identityClient
  );

  if (tenancyCompartment) compartments.unshift(tenancyCompartment);

  return compartments;
};
