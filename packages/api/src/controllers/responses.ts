import type { Response } from "express";
import type { ValidationError } from "yup";

export const successResponse = (response: Response, data: any) => {
  return response.status(200).send({
    data,
    message: "success",
  });
};

export const oldRequestFailureResponse = (response: Response) => {
  return response.status(409).send({
    data: {},
    message: "more recent request was already submitted",
  });
};

export const validationError = (
  response: Response,
  validationError: ValidationError
) => {
  return response.status(400).send({
    data: {},
    message: validationError.errors,
  });
};
