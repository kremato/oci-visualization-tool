import type { Request, Response } from "express";
import { Cache } from "../services/cache";

export const listRegionSubscriptions = (_req: Request, res: Response): void => {
  res.status(200).send(JSON.stringify(Cache.getInstance().regionSubscriptions));
};
