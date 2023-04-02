import type { NextFunction, Request, Response } from "express";
import { registeredClients } from "../controllers/configuration";
import { badTokenResponse } from "../controllers/responses";

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

//checkRegistrationToken({} as any, {} as any, {} as any);
