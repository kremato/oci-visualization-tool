import type { limits } from "common";
import path from "path";
import { getLimitsClient } from "./clients/getLimitsClient";
import { log } from "../utils/log";
import { outputToFile } from "../utils/outputToFile";
import { getProvider } from "./clients/getProvider";

const filePath = path.basename(__filename);

export const listLimitDefinitionSummaries = async (
  profile: string
): Promise<limits.models.LimitDefinitionSummary[]> => {
  const limitsClient = getLimitsClient(profile);
  const listLimitDefinitionsRequest: limits.requests.ListLimitDefinitionsRequest =
    {
      // must be tenancy
      compartmentId: getProvider(profile).getTenantId(),
    };

  let logJSON: string = "";
  let opc: string | undefined = undefined;
  let limiDefinitionsSummaries: limits.models.LimitDefinitionSummary[] = [];
  do {
    !opc || (listLimitDefinitionsRequest.page = opc);

    let listLimitDefinitionsResponse:
      | limits.responses.ListLimitDefinitionsResponse
      | undefined = undefined;
    try {
      listLimitDefinitionsResponse = await limitsClient.listLimitDefinitions(
        listLimitDefinitionsRequest
      );
    } catch (error) {
      log(
        filePath,
        "fetching of limitDefinitionSummaries failed, ABORTING further fetching"
      );
      break;
    }

    limiDefinitionsSummaries = limiDefinitionsSummaries.concat(
      listLimitDefinitionsResponse.items
    );
    logJSON += JSON.stringify(listLimitDefinitionsResponse.items, null, 4);

    opc = listLimitDefinitionsResponse.opcNextPage;
  } while (opc);

  outputToFile("test/limitDefinitionListAll", logJSON);
  return limiDefinitionsSummaries;
};
