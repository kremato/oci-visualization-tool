import type { Request, Response } from "express";
import { Cache } from "../services/cache";
import { successResponse } from "../utils/expressResponses";

export const list = (_req: Request, res: Response) => {
  return successResponse(res, Cache.getInstance().getServices());
};
