import type { MyLimitDefinitionSummary, identity, UniqueLimit } from "common";
import type { Request, Response } from "express";
import { Cache } from "../services/cache";
import type { InputData, TypedRequest } from "../types/types";
import { loadUniqueLimit } from "../services/loadUniqueLimit";
import { outputToFile } from "../utils/outputToFile";
import path from "path";
import { log } from "../utils/log";
import {
  oldRequestFailureResponse,
  successResponse,
} from "../utils/expressResponses";
import { registeredClients } from "./configuration";
import EventEmitter from "events";

export const list = (_req: Request, res: Response) => {
  return successResponse(
    res,
    Cache.getInstance().getLimitDefinitionsGroupedByLimitName
  );
};

export const closingSessionEmmiter = new EventEmitter();

// make sure proper middleware is run before the use of a TypedRequest
export const store = async (
  req: TypedRequest<InputData, { id: string }>,
  res: Response
) => {
  const token = req.params.id;
  const data = req.body;
  const cache = Cache.getInstance();
  let newRequest = false;

  closingSessionEmmiter.once(token, () => {
    newRequest = true;
  });

  if (data.invalidateCache) {
    Cache.getInstance().clear();
  }

  const filteredCompartments = cache.getCompartments().filter((compartment) => {
    return data.compartments.includes(compartment.id);
  });
  const filteredRegions = cache.getSubscribedRegions().filter((region) => {
    return data.regions.includes(region.regionName);
  });
  const filteredServices = cache.getServices().filter((service) => {
    return data.services.includes(service.name);
  });

  const loadLimitArguments: [
    identity.models.Compartment,
    string,
    MyLimitDefinitionSummary
  ][] = [];
  let countLimitDefinitionSummaries = 0;
  const failedServices: string[] = [];
  for (const compartment of filteredCompartments) {
    for (const region of filteredRegions) {
      for (const service of filteredServices) {
        let limitDefinitionSummaries = cache.getLimitDefinitionsPerService(
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

        for (const LimitDefinitionSummary of limitDefinitionSummaries) {
          loadLimitArguments.push([
            compartment,
            region.regionName,
            LimitDefinitionSummary,
          ]);
          countLimitDefinitionSummaries++;
        }
      }
    }
  }

  let countLoadedLimits = 0;
  const loadedLimits: UniqueLimit[] = [];
  while (loadLimitArguments.length > 0 && !newRequest) {
    console.log("loading limits");
    const promises = loadLimitArguments
      .splice(0, 30)
      .map((item) => loadUniqueLimit(...item));
    const startTime = performance.now();
    const uniqueLimits = await Promise.all(promises);
    const endTime = performance.now();
    for (const limit of uniqueLimits) {
      cache.addUniqueLimit(limit);
      loadedLimits.push(limit);
    }

    countLoadedLimits += uniqueLimits.length;

    /* send progress update only if promise fetching took more
    than half a second so the client is not overwhelmed */
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

  outputToFile("test/postLimitsResponse.txt", JSON.stringify(loadedLimits));

  return newRequest
    ? oldRequestFailureResponse(res)
    : successResponse(res, loadedLimits);
};
