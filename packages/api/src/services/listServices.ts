import type { limits } from "oci-sdk";
import { Provider } from "../clients/provider";
import { getLimitsClient } from "../clients/getLimitsClient";

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

  const result = [];
  for await (let item of iterator) {
    result.push(item);
  }

  return result;
};
