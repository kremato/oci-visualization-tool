import type { NextFunction, Request, Response } from "express";
import type { ValidationError } from "yup";
import { validationError } from "../utils/expressResponses";
import { storeLimitsSchema } from "../utils/validationSchemas";

export const validateStoreLimitsBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await storeLimitsSchema.validate(req.body);
  } catch (error) {
    return validationError(res, error as ValidationError);
  }
  return next();
};
