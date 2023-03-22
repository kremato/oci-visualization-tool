import { getLimitsClient } from "../clients/getLimitsClient";
import type { limits } from "common";
import { Provider } from "./provider";

// List of available servies for the root compartment/tenancy.
export const listServices = async (): Promise<
  limits.models.ServiceSummary[]
> => {
  const limitsClient = getLimitsClient();
  const listServicesRequest: limits.requests.ListServicesRequest = {
    // must be tenancy
    compartmentId: Provider.getInstance().provider.getTenantId(),
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
