import { Cache } from "../services/cache";
import { apiIsNotReadyResponse, successResponse } from "./responses";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import type WebSocket from "ws";
import { common } from "common";

let apiIsReady = false;
export const registeredClients = new Map<
  string,
  WebSocket.WebSocket | undefined
>();

export const onStart = async (): Promise<void> => {
  console.log(`[server]: Server is running`);
  /* Set retry configuration globally */
  common.GenericRetrier.defaultRetryConfiguration = {
    retryCondition: (error) =>
      !(error.statusCode >= 500) &&
      common.OciSdkDefaultRetryConfiguration.retryCondition(error),
  };
  /* Wait for cache to fetch startup data */
  await Cache.getInstance().Ready;
  apiIsReady = true;
  console.log("[server]: App.use() finished");
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
