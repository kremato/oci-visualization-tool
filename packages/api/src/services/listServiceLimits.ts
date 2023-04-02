import { identity, limits } from "common";
import path from "path";
import type { MyAvailabilityDomain } from "../types/types";
import { log } from "../utils/log";
import { Provider } from "./provider";

/* The function retrieves a catalog of service limits associated with a specific
limit and service name. If the limit is AD scoped and the region includes multiple
ADs, the resulting list can have multiple entries, each corresponding to a particular AD .*/
export const listServiceLimits = async (
  serviceName: string,
  limitName: string,
  regionId: string,
  availabilityDomain?: identity.models.AvailabilityDomain | MyAvailabilityDomain
): Promise<limits.models.LimitValueSummary[]> => {
  const client = new limits.LimitsClient({
    authenticationDetailsProvider: Provider.getInstance().provider,
  });
  client.regionId = regionId;
  const listLimitValuesRequest: limits.requests.ListLimitValuesRequest = {
    compartmentId: Provider.getInstance().provider.getTenantId(),
    serviceName: serviceName,
    name: limitName,
    ...(availabilityDomain && {
      availabilityDomain: availabilityDomain.name,
    }),
    limit: 1000,
  };

  let opc: string | undefined = undefined;
  let limitValueSummaries: limits.models.LimitValueSummary[] = [];
  do {
    !opc || (listLimitValuesRequest.page = opc);

    let listLimitValuesResponse:
      | limits.responses.ListLimitValuesResponse
      | undefined = undefined;
    try {
      listLimitValuesResponse = await client.listLimitValues(
        listLimitValuesRequest
      );
    } catch (error) {
      log(
        path.basename(__filename),
        `fetching of service limits for ${limitName} limit and
        ${serviceName} service failed, ABORTING further fetching`
      );
      break;
    }

    limitValueSummaries = limitValueSummaries.concat(
      listLimitValuesResponse.items
    );
    opc = listLimitValuesResponse.opcNextPage;
  } while (opc);

  return limitValueSummaries;
};
