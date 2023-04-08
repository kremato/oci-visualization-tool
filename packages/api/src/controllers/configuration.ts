import {
  profileIsNotReadyResponse,
  successResponse,
} from "../utils/expressResponses";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import type WebSocket from "ws";
import { common } from "common";
import { Cache } from "../services/cache/cache";
import type { TypedRequest } from "../types/types";

export const registeredClients = new Map<
  string,
  WebSocket.WebSocket | undefined
>();

export const start = async (): Promise<void> => {
  console.log(`[api]: api is running`);
  /* Set retry configuration globally */
  common.GenericRetrier.defaultRetryConfiguration = {
    retryCondition: (error) =>
      !(error.statusCode >= 500) &&
      common.OciSdkDefaultRetryConfiguration.retryCondition(error),
  };
  /* Get cache so the constructor is fired and startup data is loaded */
  Cache.getInstance();
  console.log("[api]: api is ready");
};

export const ping = async (
  req: TypedRequest<any, any, { profile: string }>,
  res: Response
) => {
  let promiseReject: (reason?: any) => void;
  setTimeout(() => {
    if (typeof promiseReject !== "undefined") promiseReject();
  }, 300);
  const cacheIsReady = new Promise(async (resolve, reject) => {
    promiseReject = reject;
    await Cache.getInstance().getProfileCache(req.query.profile)!.Ready;
    resolve(undefined);
  });
  try {
    await cacheIsReady;
  } catch {
    return profileIsNotReadyResponse(res);
  }
  return successResponse(res, {});
};

export const signup = (_req: Request, res: Response) => {
  let uuid;
  do {
    uuid = uuidv4();
  } while (registeredClients.has(uuid));
  registeredClients.set(uuid, undefined);
  return successResponse(res, uuid);
};
