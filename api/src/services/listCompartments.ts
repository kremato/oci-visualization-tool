import { getCompartment } from "./getCompartment";
import type { identity } from "oci-sdk";
import { getIdentityClient } from "../clients/getIdentityClient";
import type { Compartment } from "../types/types";
import { Provider } from "../clients/clients";

export const listCompartments = async (
  compartmentId: string,
  compartmentIdInSubtree = false
): Promise<Compartment[]> => {
  const identityClient = getIdentityClient(Provider.getInstance().provider);

  const listCompartmentsRequest: identity.requests.ListCompartmentsRequest = {
    compartmentId,
    compartmentIdInSubtree,
  };
  const response = await identityClient.listCompartments(
    listCompartmentsRequest
  );
  const parentCompartment = [
    await getCompartment(compartmentId, identityClient),
  ];
  return parentCompartment.concat(response.items);
};
