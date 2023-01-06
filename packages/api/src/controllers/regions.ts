import type { Request, Response } from "express";
import { Cache } from "../services/cache";
import { successResponse } from "./responses";

export const listRegionSubscriptions = (_req: Request, res: Response) => {
  return successResponse(res, Cache.getInstance().regionSubscriptions);
};
