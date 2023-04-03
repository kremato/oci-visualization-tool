import type { NextFunction, Request, Response } from "express";
import { registeredClients } from "../controllers/configuration";
import { badTokenResponse } from "../utils/expressResponses";

export const checkRegistrationToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.params["id"];
  if (token === undefined || !registeredClients.has(token)) {
    return badTokenResponse(res);
  }
  return next();
};
