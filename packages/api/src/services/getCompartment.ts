import type { identity } from "oci-sdk";
import path from "path";
import { log } from "../utils/log";

export const getCompartment = async (
  compartmentId: string,
  identityClient: identity.IdentityClient
): Promise<identity.models.Compartment | undefined> => {
  const getCompartmentRequest: identity.requests.GetCompartmentRequest = {
    compartmentId,
  };
  let compartment: identity.models.Compartment | undefined = undefined;
  try {
    compartment = (await identityClient.getCompartment(getCompartmentRequest))
      .compartment;
  } catch (error) {
    log(
      path.basename(__filename),
      `unable to fetch a compartment with ${compartmentId}`
    );
  }
  return compartment;
};
