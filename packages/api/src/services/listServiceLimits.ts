import { identity, limits } from "common";
import path from "path";
import type { MyAvailabilityDomain } from "../types/types";
import { log } from "../utils/log";
import { getProvider } from "./clients/getProvider";
import { Cache } from "./cache/cache";

/* The function retrieves a catalog of service limits associated with a specific
limit and service name. If the limit is AD scoped and the region includes multiple
ADs, the resulting list can have multiple entries, each corresponding to a particular AD .*/
export const listServiceLimits = async (
  profile: string,
  serviceName: string,
  limitName: string,
  regionId: string,
  scopeType?: limits.requests.ListLimitValuesRequest.ScopeType,
  availabilityDomain?: identity.models.AvailabilityDomain | MyAvailabilityDomain
): Promise<limits.models.LimitValueSummary[]> => {
  limits.requests.ListLimitValuesRequest.ScopeType.Ad.toString();
  const authenticationDetailsProvider =
    Cache.getProvider(profile) || getProvider(profile);
  const client = new limits.LimitsClient({
    authenticationDetailsProvider,
  });
  client.regionId = regionId;
  const listLimitValuesRequest: limits.requests.ListLimitValuesRequest = {
    compartmentId: authenticationDetailsProvider.getTenantId(),
    serviceName: serviceName,
    name: limitName,
    ...(scopeType && {
      scopeType: scopeType,
    }),
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
