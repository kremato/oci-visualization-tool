import type { identity } from "common";
import type { MyAvailabilityDomain } from "../types/types";
import { myAvailabilityDomainSchema } from "./validationSchemas";

const availabilityDomainFilter = async (
  availabilityDomain: identity.models.AvailabilityDomain
): Promise<MyAvailabilityDomain | undefined> => {
  let myAvailabilityDomain: MyAvailabilityDomain | undefined = undefined;
  try {
    myAvailabilityDomain = await myAvailabilityDomainSchema.validate(
      availabilityDomain
    );
  } catch (error) {}
  return myAvailabilityDomain;
};

export const filterAvailabilityDomains = async (
  availabilityDomains: identity.models.AvailabilityDomain[]
): Promise<MyAvailabilityDomain[]> => {
  const myAvailabilityDomains: MyAvailabilityDomain[] = [];
  for (const domain of availabilityDomains) {
    const myAvailabilityDomain = await availabilityDomainFilter(domain);
    if (myAvailabilityDomain) myAvailabilityDomains.push(myAvailabilityDomain);
  }
  return myAvailabilityDomains;
};
