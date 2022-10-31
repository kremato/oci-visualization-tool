import type { limits } from "oci-sdk";
import { getLimitsClient } from "../clients/getLimitsClient";
import type { ServiceSummary } from "../types/types";

/* I was not able to find a request that would be able to list
   all services that OCI offers. So for the time being, list
   of available servies for the root compartment/tenancy is
   used. Although the tenancy may be exactly what is needed */
export const listServices = async (tenancyId: string) => {
  const limitsClient = getLimitsClient();
  const listServicesRequest: limits.requests.ListServicesRequest = {
    compartmentId: tenancyId,
  };

  const iterator = limitsClient.listServicesRecordIterator(listServicesRequest);

  const result: ServiceSummary[] = [];
  for await (let item of iterator) {
    if (item.name === undefined) {
      console.log("[listServices.ts]: Service with 'undefined' name filtered.");
      continue;
    }
    result.push(item as ServiceSummary);
  }

  return result;
};
