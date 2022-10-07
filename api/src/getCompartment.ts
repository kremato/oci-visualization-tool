import type * as identity from "oci-identity";

export const getCompartment = async (
  compartmentId: string,
  identityClient: identity.IdentityClient
): Promise<identity.models.Compartment> => {
  const getCompartmentRequest: identity.requests.GetCompartmentRequest = {
    compartmentId,
  };
  const response = await identityClient.getCompartment(getCompartmentRequest);
  return response.compartment;
};
