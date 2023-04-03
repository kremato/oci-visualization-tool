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
    message: "more recent request was submitted",
  });
};

export const badTokenResponse = (response: Response) => {
  return response.status(422).send({
    data: {},
    message: "token specified in the path is not found",
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

export const apiIsNotReadyResponse = (response: Response) => {
  return response.status(503).send({
    data: {},
    message: "api is not ready",
  });
};
