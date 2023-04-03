import type { NextFunction, Request, Response } from "express";
import { closingSessionEmmiter } from "../controllers/limits";

export const emitClosingSession = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.params["id"];
  if (token) closingSessionEmmiter.emit(token);
  return next();
};
