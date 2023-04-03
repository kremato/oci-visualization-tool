import { limits, UniqueLimit } from "common";

const addTotal = (value: string): number => {
  return value === "n/a" ? 0 : Number(value);
};

export const calculateResourceSum = (uniqueLimit: UniqueLimit) => {
  let totalServiceLimit = 0;
  let totalAvailable = 0;
  let totalUsed = 0;
  let totalQuota = 0;
  for (const resourceObject of uniqueLimit.resources) {
    totalServiceLimit += addTotal(resourceObject.serviceLimit);
    totalAvailable += addTotal(resourceObject.available);
    totalUsed += addTotal(resourceObject.used);
    totalQuota += addTotal(resourceObject.quota);
  }
  uniqueLimit.resourceSum.scope =
    uniqueLimit.scope === limits.models.LimitDefinitionSummary.ScopeType.Ad
      ? "SUM"
      : uniqueLimit.regionId;
  uniqueLimit.resourceSum.serviceLimit = totalServiceLimit.toString();
  uniqueLimit.resourceSum.available = totalAvailable.toString();
  uniqueLimit.resourceSum.used = totalUsed.toString();
  uniqueLimit.resourceSum.quota = totalQuota.toString();
};
