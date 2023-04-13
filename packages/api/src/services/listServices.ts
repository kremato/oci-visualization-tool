import { getLimitsClient } from "./clients/getLimitsClient";
import type { limits } from "common";
import { getProvider } from "./clients/getProvider";
import { Cache } from "./cache/cache";

// List of available servies for the root compartment/tenancy.
export const listServices = async (
  profile: string
): Promise<limits.models.ServiceSummary[]> => {
  const limitsClient = getLimitsClient(profile);
  const listServicesRequest: limits.requests.ListServicesRequest = {
    // must be tenancy
    compartmentId: (
      Cache.getProvider(profile) || getProvider(profile)
    ).getTenantId(),
  };

  const serviceSummaries = (
    await limitsClient.listServices(listServicesRequest)
  ).items;
  const filteredSummaries: limits.models.ServiceSummary[] = [];

  for (const serviceSummary of serviceSummaries) {
    filteredSummaries.push(serviceSummary);
  }

  return filteredSummaries;
};
