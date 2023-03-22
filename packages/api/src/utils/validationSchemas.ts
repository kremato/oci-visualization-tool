import { limits } from "common";
import * as yup from "yup";

export const myLimitDefinitionSummarySchema = yup.object({
  name: yup.string().defined("Limit name has to be defined"),
  serviceName: yup.string().defined(),
  scopeType: yup
    .mixed<
      | limits.models.LimitDefinitionSummary.ScopeType.Ad
      | limits.models.LimitDefinitionSummary.ScopeType.Region
    >()
    .oneOf(
      [
        limits.models.LimitDefinitionSummary.ScopeType.Ad,
        limits.models.LimitDefinitionSummary.ScopeType.Region,
      ],
      "Only region and AD scope LimitDefinitionSummary is accepted"
    )
    .defined(),
});

/* export const myLimitValueSummarySchema = yup.object({
  name: yup.string().defined("Limit name has to be defined"),
  scopeType: yup
    .mixed()
    .oneOf(
      [
        limits.models.LimitValueSummary.ScopeType.Ad,
        limits.models.LimitValueSummary.ScopeType.Region,
      ],
      "Only region and AD scope LimitValueSummary is accepted"
    )
    .defined(),
  availabilityDomain: yup.string().when("scopeType", {
    is: limits.models.LimitValueSummary.ScopeType.Ad,
    then: (schema) =>
      schema.required(
        "In case the scopeType === LimitValueSummary.ScopeType.Ad, then availabilityDomain hast to be defined"
      ),
    otherwise: (schema) => schema.optional(),
  }),
}); */

export const myAvailabilityDomainSchema = yup.object({
  name: yup.string().defined(),
});

export const myServiceSummarySchema = yup.object({
  name: yup.string().defined(),
  description: yup.string().defined(),
});

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
