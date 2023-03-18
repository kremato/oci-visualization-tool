import type { MyLimitDefinitionSummary, identity } from "common";
import type { Request, Response } from "express";
import { Cache } from "../services/cache";
import type { InputData, MyLimitValueSummary } from "../types/types";
import { createResponseTreeNode } from "../utils/createResponseTreeNode";
import { listServiceLimitsPerService } from "../services/listServiceLimitsPerService";
import { loadUniqueLimit } from "../services/loadUniqueLimit";
import { sortLimits } from "../utils/sortLimits";
import { outputToFile } from "../utils/outputToFile";
import path from "path";
import { log } from "../utils/log";
import { loadResponseTree } from "../services/loadResponseTree";
import { storeLimitsSchema } from "../utils/validationSchemas";
import {
  badTokenResponse,
  oldRequestFailureResponse,
  successResponse,
  validationError,
} from "./responses";
import type { ValidationError } from "yup";
import { registeredClients } from "./configuration";
import EventEmitter from "events";

// returns a list of of limits grouped by limit name(each group has its own list)
export const list = (_req: Request, res: Response) => {
  return successResponse(res, [
    ...Cache.getInstance().limitDefinitionsPerLimitName.values(),
  ]);
};

export const closingSessionEmmiter = new EventEmitter();

export const store = async (req: Request, res: Response) => {
  const token = req.params["id"];

  if (token === undefined || !registeredClients.has(token)) {
    return badTokenResponse(res);
  }

  let data: InputData;
  try {
    data = (await storeLimitsSchema.validate(req.body)) as InputData;
  } catch (error) {
    return validationError(res, error as ValidationError);
  }

  const cache = Cache.getInstance();

  closingSessionEmmiter.emit(token);
  let newRequest = false;
  closingSessionEmmiter.once(token, () => {
    newRequest = true;
  });

  if (data.invalidateCache) {
    Cache.getInstance().clear();
  }

  const filteredCompartments = cache.compartments.filter((compartment) => {
    return data.compartments.includes(compartment.id);
  });
  const filteredRegions = cache.regionSubscriptions.filter((region) => {
    return data.regions.includes(region.regionName);
  });
  const filteredServices = cache.serviceSubscriptions.filter((service) => {
    return data.services.includes(service.name);
  });

  const loadLimitArguments: [
    identity.models.Compartment,
    identity.models.RegionSubscription,
    MyLimitDefinitionSummary,
    MyLimitValueSummary[]
  ][] = [];
  let countLimitDefinitionSummaries = 0;
  const failedServices: string[] = [];
  for (const compartment of filteredCompartments) {
    for (const region of filteredRegions) {
      for (const service of filteredServices) {
        let limitDefinitionSummaries = cache.limitDefinitionsPerService.get(
          service.name
        );

        if (!limitDefinitionSummaries) {
          log(
            path.basename(__filename),
            `no limitDefinitionSummaries found for ${service.name} service`
          );
          failedServices.push(service.name);
          continue;
        }

        // if specified, load only values about requested limits, not for the whole service
        if (data.limits.length > 0) {
          limitDefinitionSummaries = limitDefinitionSummaries.filter((limit) =>
            data.limits.some(
              (item) =>
                item.limitName === limit.name &&
                item.serviceName === limit.serviceName
            )
          );
        }

        // check for service limit values
        if (
          !cache.serviceLimitMap.get(region)!.has(service.name) &&
          !newRequest
        ) {
          cache.serviceLimitMap
            .get(region)!
            .set(
              service.name,
              await listServiceLimitsPerService(service.name, region.regionName)
            );
        }

        if (newRequest) {
          return oldRequestFailureResponse(res);
        }

        for (const LimitDefinitionSummary of limitDefinitionSummaries) {
          loadLimitArguments.push([
            compartment,
            region,
            LimitDefinitionSummary,
            cache.serviceLimitMap.get(region)!.get(service.name)!,
          ]);
          countLimitDefinitionSummaries++;
        }
      }
    }
  }

  const rootCompartmentTree = createResponseTreeNode("rootCompartments");
  const rootServiceTree = createResponseTreeNode("rootServices");
  let countLoadedLimits = 0;
  while (loadLimitArguments.length > 0) {
    if (newRequest) {
      return oldRequestFailureResponse(res);
    }
    console.log("loading limits");
    const promises = loadLimitArguments
      .splice(0, 20)
      .map((item) => loadUniqueLimit(...item));

    const startTime = performance.now();
    const uniqueLimits = await Promise.all(promises);
    const endTime = performance.now();
    for (const limit of uniqueLimits) {
      if (!newRequest) cache.addLimit(limit);
      loadResponseTree(limit, rootCompartmentTree, "compartment");
      loadResponseTree(limit, rootServiceTree, "service");
    }

    countLoadedLimits += uniqueLimits.length;

    /* send progress update only if promise fetching took more than half a second
    so the client is not overwhelmed and synchronization issues dont arise */
    if (!newRequest && endTime - startTime >= 500) {
      registeredClients.get(token)?.send(
        JSON.stringify({
          failedServices,
          countLoadedLimits,
          countLimitDefinitionSummaries,
        })
      );
    }
  }

  sortLimits(rootCompartmentTree);
  sortLimits(rootServiceTree);
  outputToFile(
    "test/postLimitsResponse.txt",
    JSON.stringify([rootCompartmentTree, rootServiceTree])
  );

  return newRequest
    ? oldRequestFailureResponse(res)
    : successResponse(res, [rootCompartmentTree, rootServiceTree]);
};
