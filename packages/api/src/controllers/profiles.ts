import type { Request, Response } from "express";
import {
  profileIsNotReadyResponse,
  successResponse,
} from "../utils/expressResponses";
import { Cache } from "../services/cache/cache";
import type { TypedRequest } from "../types/types";

export const list = (_req: Request, res: Response) => {
  return successResponse(res, Cache.getInstance().getProfiles());
};

export const defaultProfile = (_req: Request, res: Response) => {
  return successResponse(res, Cache.getInstance().getProfiles());
};

export const profileStatus = async (
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
