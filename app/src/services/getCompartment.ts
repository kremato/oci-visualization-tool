import type  * as identity from "oci-identity";

export const getCompartment = async (
  identityClient: identity.IdentityClient,
  compartmentId: string,
): Promise<identity.models.Compartment> => {
  const getCompartmentRequest: identity.requests.GetCompartmentRequest = {
    compartmentId
  }
  const response = await identityClient.getCompartment(getCompartmentRequest)
  return response.compartment
};
