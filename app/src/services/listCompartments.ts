import type * as identity from "oci-identity";

export const listCompartments = async (
  identityClient: identity.IdentityClient,
  compartmentId: string,
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
