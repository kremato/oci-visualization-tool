import { Cache } from "../services/cache";
import { getLimitDefinitionsPerProperty } from "../services/getLimitDefinitionsPerProperty";
import { listCompartments } from "../services/listCompartments";
import { listRegionSubscriptions } from "../services/listRegionSubscriptions";
import { listServices } from "../services/listServices";
import { apiIsNotReadyResponse, successResponse } from "./responses";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import type WebSocket from "ws";
import { listLimitDefinitionSummaries } from "../services/listLimitDefinitionSummaries";
import { findGloballyScopedServices } from "../utils/findGlobalScopeServices";
import type { MyLimitDefinitionsPerProperty } from "../types/types";

let apiIsReady = false;
export const registeredClients = new Map<
  string,
  WebSocket.WebSocket | undefined
>();

export const onStart = async (): Promise<void> => {
  console.log(`[server]: Server is running`);
  const cache = Cache.getInstance();

  cache.compartments = await listCompartments();
  cache.regionSubscriptions = await listRegionSubscriptions();
  const limiDefinitionSummaries = await listLimitDefinitionSummaries();
  const globallyScopedServices = await findGloballyScopedServices(
    limiDefinitionSummaries
  );
  cache.serviceSubscriptions = (await listServices()).filter(
    (service) => !globallyScopedServices.includes(service.name)
  );
  cache.limitDefinitionsPerLimitName = getLimitDefinitionsPerProperty(
    limiDefinitionSummaries,
    "name",
    true
  ) as MyLimitDefinitionsPerProperty;
  cache.limitDefinitionsPerService = getLimitDefinitionsPerProperty(
    limiDefinitionSummaries,
    "serviceName",
    true
  ) as MyLimitDefinitionsPerProperty;
  cache.regionSubscriptions.forEach((region) =>
    cache.serviceLimitMap.set(region, new Map())
  );
  console.log("[server]: App.use() finished");
  apiIsReady = true;
};

export const onPing = (_req: Request, res: Response) => {
  if (!apiIsReady) {
    return apiIsNotReadyResponse(res);
  }
  return successResponse(res, {});
};

export const onSignup = (_req: Request, res: Response) => {
  let uuid;
  do {
    uuid = uuidv4();
  } while (registeredClients.has(uuid));
  registeredClients.set(uuid, undefined);
  return successResponse(res, uuid);
};
