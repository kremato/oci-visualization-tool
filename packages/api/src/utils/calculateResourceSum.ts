import { limits, UniqueLimit } from "common";

export const calculateResourceSum = (uniqueLimit: UniqueLimit) => {
  let totalServiceLimit = 0;
  let totalAvailable = 0;
  let totalUsed = 0;
  let totalQuota = 0;
  for (const resourceObject of uniqueLimit.resources) {
    totalServiceLimit +=
      resourceObject.serviceLimit === "n/a"
        ? 0
        : Number(resourceObject.serviceLimit);
    totalAvailable +=
      resourceObject.available === "n/a" ? 0 : Number(resourceObject.available);
    totalUsed +=
      resourceObject.used === "n/a" ? 0 : Number(resourceObject.used);
    totalQuota +=
      resourceObject.quota === "n/a" ? 0 : Number(resourceObject.quota);
  }
  uniqueLimit.resourceSum.availabilityDomain =
    uniqueLimit.scope === limits.models.LimitDefinitionSummary.ScopeType.Ad
      ? "SUM"
      : "REGION";
  uniqueLimit.resourceSum.serviceLimit = totalServiceLimit.toString();
  uniqueLimit.resourceSum.available = totalAvailable.toString();
  uniqueLimit.resourceSum.used = totalUsed.toString();
  uniqueLimit.resourceSum.quota = totalQuota.toString();
};
