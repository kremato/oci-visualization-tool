import type * as identity from "oci-identity";
import { getCompartment } from "./getCompartment";

export const listCompartments = async (
  compartmentId: string,
  identityClient: identity.IdentityClient,
  compartmentIdInSubtree = false
): Promise<identity.models.Compartment[]> => {
  const listCompartmentsRequest: identity.requests.ListCompartmentsRequest = {
    compartmentId,
    compartmentIdInSubtree,
  };
  const response = await identityClient.listCompartments(
    listCompartmentsRequest
  );
  const parentCompartment = [await getCompartment(compartmentId, identityClient)]
  return parentCompartment.concat(response.items);
};
