import type { Request, Response } from "express";
import { successResponse } from "../utils/expressResponses";
import { Cache } from "../services/cache/cache";

export const profiles = (_req: Request, res: Response) => {
  return successResponse(res, Cache.getInstance().getProfiles());
};
