import type { Response } from "express";
import { successResponse } from "../utils/expressResponses";
import { Cache } from "../services/cache/cache";
import type { TypedRequest } from "../types/types";

export const listRegionSubscriptions = (
  req: TypedRequest<any, any, { profile: string }>,
  res: Response
) => {
  return successResponse(
    res,
    Cache.getInstance()
      .getProfileCache(req.query.profile)!
      .getSubscribedRegions()
  );
};
