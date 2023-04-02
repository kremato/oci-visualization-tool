import type {
  MyLimitDefinitionSummary,
  identity,
  ResourceObject,
} from "common";
import type { MyAvailabilityDomain, MyLimitValueSummary } from "../types/types";
import { getResourceAvailability } from "./getResourceAvailability";
import { listServiceLimits } from "./listServiceLimits";

const maxValue = Number.MAX_SAFE_INTEGER;

const getResourceAvailibilityForUndefinedAndMaxValue = (
  property: number | undefined
) =>
  property !== undefined && property <= maxValue ? property.toString() : "n/a";

export const getResourceObject = async (
  compartmentId: string,
  limitDefinitionSummary: MyLimitDefinitionSummary,
  regionId: string,
  availabilityDomain?: identity.models.AvailabilityDomain | MyAvailabilityDomain
): Promise<ResourceObject | undefined> => {
  const resourceAvailability = await getResourceAvailability(
    compartmentId,
    limitDefinitionSummary,
    regionId,
    availabilityDomain
  );

  if (!resourceAvailability) return;

  const available = getResourceAvailibilityForUndefinedAndMaxValue(
    resourceAvailability.available
  );
  const used = getResourceAvailibilityForUndefinedAndMaxValue(
    resourceAvailability.used
  );
  const quota = getResourceAvailibilityForUndefinedAndMaxValue(
    resourceAvailability.effectiveQuotaValue
  );

  let serviceLimits: MyLimitValueSummary[] = (await listServiceLimits(
    limitDefinitionSummary.serviceName,
    limitDefinitionSummary.name,
    regionId
  )) as MyLimitValueSummary[];

  const summary = serviceLimits.find(
    (summary) =>
      summary.availabilityDomain === availabilityDomain?.name &&
      summary.scopeType === limitDefinitionSummary.scopeType &&
      summary.name === limitDefinitionSummary.name
  );
  const serviceLimit = getResourceAvailibilityForUndefinedAndMaxValue(
    summary?.value
  );
  return {
    availabilityDomain: availabilityDomain ? availabilityDomain.name : "REGION",
    serviceLimit,
    available,
    used,
    quota,
  };
};
