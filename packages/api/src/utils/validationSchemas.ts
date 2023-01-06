import * as yup from "yup";

export const storeLimitsSchema = yup.object({
  compartments: yup.array().of(yup.string().defined()).required(),
  regions: yup.array().of(yup.string().defined()).required(),
  services: yup.array().of(yup.string().defined()).required(),
  limits: yup
    .array()
    .of(
      yup.object({
        limitName: yup.string().required(),
        serviceName: yup.string().required(),
      })
    )
    .required(),
  invalidateCache: yup.boolean().required().defined(),
});
