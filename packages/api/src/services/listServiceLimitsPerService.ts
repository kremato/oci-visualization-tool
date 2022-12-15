import * as limits from "oci-limits";

import { Provider } from "../clients/provider";
import type { MyLimitValueSummary } from "../types/types";
import { outputToFile } from "../utils/outputToFile";

export const listServiceLimitsPerService = async (
  serviceName: string
): Promise<MyLimitValueSummary[]> => {
  const client = new limits.LimitsClient({
    authenticationDetailsProvider: Provider.getInstance().provider,
  });
  const listLimitValuesRequest: limits.requests.ListLimitValuesRequest = {
    compartmentId: Provider.getInstance().provider.getTenantId(),
    serviceName: serviceName,
    limit: 1000,
  };

  let logJSON = "";
  let opc: string | undefined = undefined;
  let response: MyLimitValueSummary[] = [];
  do {
    !opc || (listLimitValuesRequest.page = opc);

    const listLimitValuesResponse = await client.listLimitValues(
      listLimitValuesRequest
    );
    logJSON += JSON.stringify(listLimitValuesResponse.items, null, 4);

    response = response.concat(
      listLimitValuesResponse.items.filter(
        (serviceLimit) => serviceLimit.name
      ) as MyLimitValueSummary[]
    );
    opc = listLimitValuesResponse.opcNextPage;
  } while (opc);

  outputToFile("test/listLimitValues.txt", logJSON);
  return response;
};
