import type { NextFunction, Request, Response } from "express";
import type { ValidationError } from "yup";
import { validationError } from "../controllers/responses";
//import type { InputData } from "../types/types";
import { storeLimitsSchema } from "../utils/validationSchemas";

export const validateStoreLimitsBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //let data: InputData;
  try {
    /* data =  */ await storeLimitsSchema.validate(req.body);
  } catch (error) {
    return validationError(res, error as ValidationError);
  }
  return next();
};

//validateStoreLimitsBody({} as any, {} as any, {} as any);
