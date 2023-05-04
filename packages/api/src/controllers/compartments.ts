import type { Response } from "express";
import { successResponse } from "../utils/expressResponses";
import type { TypedRequest } from "../types/types";
import { Cache } from "../services/cache/cache";

export const list = (
  req: TypedRequest<any, any, { profile: string }>,
  res: Response
) => {
  return successResponse(
    res,
    Cache.getInstance().getProfileCache(req.query.profile)!.getCompartments()
  );
};
