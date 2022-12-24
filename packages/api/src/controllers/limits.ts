import type {
  InputData,
  MyLimitDefinitionSummary,
  ResponseTreeNode,
} from "common";
import type { Request, Response } from "express";
import type { common } from "oci-sdk";
import { Cache } from "../services/cache";
import type { MyLimitValueSummary } from "../types/types";
import { createResponseTreeNode } from "../utils/createResponseTreeNode";
import type { Compartment } from "oci-identity/lib/model";
import { listServiceLimitsPerService } from "../services/listServiceLimitsPerService";
import { loadLimit } from "../services/loadLimit";
import { sortLimitsRotateScopes } from "../utils/sortLimitsRotateScopes";
import { outputToFile } from "../utils/outputToFile";
import path from "path";

export const list = (_req: Request, res: Response) => {
  const responseLimitDefinitionsPerLimitName = Object.create(null);
  for (const [
    key,
    value,
  ] of Cache.getInstance().limitDefinitionsPerLimitName.entries()) {
    responseLimitDefinitionsPerLimitName[key] = value;
  }
  res.status(200).send(JSON.stringify(responseLimitDefinitionsPerLimitName));
};

export const store = async (req: Request, res: Response) => {
  // TODO: validation
  const data = req.body as InputData;
  console.log("[/limits]");
  console.log(data);

  const cache = Cache.getInstance();

  const initialPostLimitsCount = cache.token.count;
  cache.token.count += 1;
  const newRequest = cache.token.count != initialPostLimitsCount + 1;

  if (data.invalidateCache) {
    Cache.getInstance().clear();
  }

  const filteredCompartments = cache.compartments.filter((compartment) => {
    return data.compartments.includes(compartment.id);
  });
  const filteredRegions = cache.regions.filter((region) => {
    return data.regions.includes(region.regionId);
  });
  const filteredServices = cache.serviceSubscriptions.filter((service) => {
    return data.services.includes(service.name);
  });

  const rootCompartmentTree = createResponseTreeNode("rootCompartments");
  const rootServiceTree = createResponseTreeNode("rootServices");
  const loadLimitArgumetns: [
    Compartment,
    common.Region,
    MyLimitDefinitionSummary,
    ResponseTreeNode,
    ResponseTreeNode,
    MyLimitValueSummary[]
  ][] = [];
  for (const compartment of filteredCompartments) {
    for (const region of filteredRegions) {
      for (const service of filteredServices) {
        // TODO: maybe for service limits it would be better if they were a map, where limit name is a key to service limits, so later we would not have to filter them with O(n)
        let limitDefinitionSummaries = cache.limitDefinitionsPerRegionPerService
          .get(region)
          ?.get(service.name);

        if (!limitDefinitionSummaries) {
          console.log(
            `[${path.basename(
              __filename
            )}]: limitDefinitionsPerService.get(region)?.get(service.name) returned undefined`
          );
          continue;
        }

        if (data.limits.length > 0) {
          limitDefinitionSummaries = limitDefinitionSummaries.filter((limit) =>
            /* data.limits.includes(limit.name) */
            data.limits.some(
              (item) =>
                item.limitName === limit.name &&
                item.serviceName === limit.serviceName
            )
          );
        }

        if (
          !cache.serviceLimitMap.has(service.name) &&
          cache.token.count === initialPostLimitsCount + 1
        )
          cache.serviceLimitMap.set(
            service.name,
            await listServiceLimitsPerService(service.name)
          );

        if (newRequest) break;

        for (const LimitDefinitionSummary of limitDefinitionSummaries) {
          loadLimitArgumetns.push([
            compartment,
            region,
            LimitDefinitionSummary,
            rootCompartmentTree,
            rootServiceTree,
            cache.serviceLimitMap.get(service.name)!,
          ]);
        }
      }
    }
  }

  while (loadLimitArgumetns.length > 0) {
    const promises = loadLimitArgumetns
      .splice(0, 15)
      .map((item) => loadLimit(...item));
    await Promise.all(promises);
    if (newRequest) {
      res.status(409).send([]);
      return;
    }
  }

  sortLimitsRotateScopes(rootCompartmentTree);
  sortLimitsRotateScopes(rootServiceTree);
  const responseData = JSON.stringify([rootCompartmentTree, rootServiceTree]);

  newRequest ? res.status(409).send([]) : res.status(200).send(responseData);
  outputToFile("test/postLimitsResponse.txt", responseData);
};
