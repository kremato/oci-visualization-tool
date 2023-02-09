import { getLimitsClient } from "../clients/getLimitsClient";
import type { MyServiceSummary, limits } from "common";
import path from "path";
import { log } from "../utils/log";
import { Provider } from "./provider";

// List of available servies for the root compartment/tenancy.
// Services with an undefined name or description are filtered out
export const listServices = async (): Promise<MyServiceSummary[]> => {
  const limitsClient = getLimitsClient();
  const listServicesRequest: limits.requests.ListServicesRequest = {
    // must be tenancy
    compartmentId: Provider.getInstance().provider.getTenantId(),
  };

  const iterator = limitsClient.listServicesRecordIterator(listServicesRequest);

  const summaries: MyServiceSummary[] = [];
  const filePath = path.basename(__filename);
  for await (let serviceSummary of iterator) {
    if (serviceSummary.name === undefined) {
      log(filePath, "service with 'undefined' name filtered out.");
      continue;
    }
    if (serviceSummary.description === undefined) {
      log(filePath, "service with 'undefined' description filtered out.");
      continue;
    }
    summaries.push(serviceSummary as MyServiceSummary);
  }

  return summaries;
};
