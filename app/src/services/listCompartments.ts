import type * as identity from "oci-identity";

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
  return response.items;
};
