import type { NextFunction, Request, Response } from "express";
import { badProfileResponse } from "../utils/expressResponses";
import { Cache } from "../services/cache/cache";

export const checkProfileQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const profile = req.query["profile"];
  if (
    profile === undefined ||
    typeof profile !== "string" ||
    Cache.getInstance().getProfileCache(profile) === undefined
  ) {
    return badProfileResponse(res);
  }
  return next();
};
