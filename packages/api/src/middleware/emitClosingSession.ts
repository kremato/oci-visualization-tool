import type { NextFunction, Request, Response } from "express";
//import { registeredClients } from "../controllers/configuration";
import { closingSessionEmmiter } from "../controllers/limits";
//import { badTokenResponse } from "../controllers/responses";

export const emitClosingSession = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.params["id"];
  if (token) closingSessionEmmiter.emit(token);
  return next();
};

//emitClosingSession({} as any, {} as any, {} as any);
