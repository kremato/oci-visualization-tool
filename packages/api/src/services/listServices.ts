import { getLimitsClient } from "../clients/getLimitsClient";
import type { MyServiceSummary, limits } from "common";
import path from "path";
import { log } from "../utils/log";
import { Provider } from "./provider";

const filePath = path.basename(__filename);

// List of available servies for the root compartment/tenancy.
// Services with an undefined name or description are filtered out
export const listServices = async (): Promise<MyServiceSummary[]> => {
  const limitsClient = getLimitsClient();
  const listServicesRequest: limits.requests.ListServicesRequest = {
    // must be tenancy
    compartmentId: Provider.getInstance().provider.getTenantId(),
  };

  const serviceSummaries = (
    await limitsClient.listServices(listServicesRequest)
  ).items;
  const filteredSummaries: MyServiceSummary[] = [];

  for (const serviceSummary of serviceSummaries) {
    if (serviceSummary.name === undefined) {
      log(filePath, "service with 'undefined' name filtered out.");
      continue;
    }
    if (serviceSummary.description === undefined) {
      log(filePath, "service with 'undefined' description filtered out.");
      continue;
    }
    filteredSummaries.push(serviceSummary as MyServiceSummary);
  }

  return filteredSummaries;
};
