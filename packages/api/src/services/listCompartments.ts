import { getCompartment } from "./getCompartment";
import type { identity } from "oci-sdk";
import { getIdentityClient } from "../clients/getIdentityClient";
import type { IdentityCompartment } from "../types/types";
import { Provider } from "../clients/provider";

export const listCompartments = async (
  compartmentId: string,
  compartmentIdInSubtree = false
): Promise<IdentityCompartment[]> => {
  const identityClient = getIdentityClient(Provider.getInstance().provider);

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
  const parentCompartment = [
    await getCompartment(compartmentId, identityClient),
  ];
  return parentCompartment.concat(response.items);
};
