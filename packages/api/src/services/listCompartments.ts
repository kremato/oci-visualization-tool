import { getCompartment } from "./getCompartment";
import type { identity } from "oci-sdk";
import { getIdentityClient } from "../clients/getIdentityClient";
import { Provider } from "../clients/provider";
import type { IdentityCompartment } from "common";

export const listCompartments = async (
  compartmentId: string,
  compartmentIdInSubtree = false
): Promise<IdentityCompartment[]> => {
  const identityClient = getIdentityClient();

  // TODO: compartmentIdInSubtree should be set inside the function rather then
  // rely on user to pass it only in case compartmentId is tenancy
  const listCompartmentsRequest: identity.requests.ListCompartmentsRequest = {
    compartmentId,
    compartmentIdInSubtree,
  };
  const response = await identityClient.listCompartments(
    listCompartmentsRequest
  );

  // TODO: this should be added only when tenancyId is passed as compartmentId
  // TODO: this does not work with my perms on netsuite compartment
  /* const parentCompartment = [
    await getCompartment(compartmentId, identityClient),
  ];
  return parentCompartment.concat(response.items); */
  return response.items;
};
