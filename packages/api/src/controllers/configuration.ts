import { successResponse } from "../utils/expressResponses";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import type WebSocket from "ws";
import { common } from "common";
import { Cache } from "../services/cache/cache";

export const registeredClients = new Map<
  string,
  WebSocket.WebSocket | undefined
>();

export const start = async (): Promise<void> => {
  console.log(`[api]: api is running`);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  /* Set retry configuration globally */
  common.GenericRetrier.defaultRetryConfiguration = {
    retryCondition: (error) =>
      !(error.statusCode >= 500) &&
      common.OciSdkDefaultRetryConfiguration.retryCondition(error),
  };
  /* Instantiate cache so the constructor is fired and startup data is loaded */
  Cache.getInstance();
  console.log("[api]: api is ready");
};

export const signup = (_req: Request, res: Response) => {
  let uuid;
  do {
    uuid = uuidv4();
  } while (registeredClients.has(uuid));
  registeredClients.set(uuid, undefined);
  return successResponse(res, uuid);
};
