import type { MyLimitDefinitionSummary, identity, UniqueLimit } from "common";
import type { Response } from "express";
import type { TypedRequest } from "../types/types";
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
import { Cache } from "../services/cache/cache";
import type { ProfileCache } from "../services/cache/profileCache";
import type { StoreLimitsBody } from "../types/types";

export const list = (
  req: TypedRequest<any, any, { profile: string }>,
  res: Response
) => {
  return successResponse(
    res,
    Cache.getInstance()
      .getProfileCache(req.query.profile)
      ?.getLimitDefinitionsGroupedByLimitName() || []
  );
};

export const closingSessionEmmiter = new EventEmitter();

// make sure proper middleware is run before the use of a TypedRequest
export const store = async (
  req: TypedRequest<StoreLimitsBody, { id: string }, { profile: string }>,
  res: Response
) => {
  const token = req.params.id;
  const body = req.body;
  const cache = Cache.getInstance().getProfileCache(req.query.profile)!;
  let newRequest = false;

  closingSessionEmmiter.once(token, () => {
    newRequest = true;
  });

  if (body.invalidateCache) {
    cache.clear();
  }

  const filteredCompartments = cache.getCompartments().filter((compartment) => {
    return body.compartments.includes(compartment.id);
  });
  const filteredRegions = cache.getSubscribedRegions().filter((region) => {
    return body.regions.includes(region.regionName);
  });
  const filteredServices = cache.getServices().filter((service) => {
    return body.services.includes(service.name);
  });

  const loadLimitArguments: [
    ProfileCache,
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
        const limits = body.limits;
        if (limits !== undefined) {
          limitDefinitionSummaries = limitDefinitionSummaries.filter((limit) =>
            limits.some(
              (item) =>
                item.limitName === limit.name &&
                item.serviceName === limit.serviceName
            )
          );
        }

        for (const LimitDefinitionSummary of limitDefinitionSummaries) {
          loadLimitArguments.push([
            Cache.getInstance().getProfileCache(req.query.profile)!,
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
