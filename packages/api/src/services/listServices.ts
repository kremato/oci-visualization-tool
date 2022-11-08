import type { limits } from "oci-sdk";
import { getLimitsClient } from "../clients/getLimitsClient";
import type { ServiceSummary } from "common";
import path from "path";

/* I was not able to find a request that would be able to list
   all services that OCI offers. So for the time being, list
   of available servies for the root compartment/tenancy is
   used. Although the tenancy may be exactly what is needed */
/* Services with an undefined name or description are filtered out */
export const listServices = async (tenancyId: string) => {
  const limitsClient = getLimitsClient();
  const listServicesRequest: limits.requests.ListServicesRequest = {
    compartmentId: tenancyId,
  };

  const iterator = limitsClient.listServicesRecordIterator(listServicesRequest);

  const result: ServiceSummary[] = [];
  for await (let serviceSummary of iterator) {
    if (serviceSummary.name === undefined) {
      console.log(
        `[${path.basename(
          __filename
        )}]: Service with 'undefined' name filtered out.`
      );
      continue;
    }
    if (serviceSummary.description === undefined) {
      console.log(
        `[${path.basename(
          __filename
        )}]: Service with 'undefined' description filtered out.`
      );
      continue;
    }
    result.push(serviceSummary as ServiceSummary);
  }

  return result;
};
