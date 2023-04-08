import type { Request, Response } from "express";
import { ProfileCache } from "../services/cache/profileCache";
import { successResponse } from "../utils/expressResponses";

export const listRegionSubscriptions = (_req: Request, res: Response) => {
  return successResponse(
    res,
    ProfileCache.getInstance().getSubscribedRegions()
  );
};
