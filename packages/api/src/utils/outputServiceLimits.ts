import type { LimitDefinitionsPerProperty } from "../types/types";
import { outputToFile } from "./outputToFile";

export const outputServiceLimits = (
  serviceLimitDefinitions: LimitDefinitionsPerProperty,
  filePath = "",
  details = true,
  deprecated = false
) => {
  let serviceLimitsOverview = "";
  const serviceLimitDefinitionsAsc = new Map(
    [...serviceLimitDefinitions.entries()].sort()
  );

  for (let [serviceName, serviceLimits] of serviceLimitDefinitionsAsc) {
    serviceLimitsOverview = serviceLimitsOverview.concat(
      `Service name: [${serviceName}]\n`
    );
    for (const limit of serviceLimits) {
      if (!deprecated && limit.isDeprecated) continue;
      serviceLimitsOverview = serviceLimitsOverview.concat(
        `  Limit name: [${limit.name}]\n`
      );
      if (details) {
        serviceLimitsOverview = serviceLimitsOverview.concat(
          `\    Description: [${limit.description}]
    Deprecated: [${limit.isDeprecated}]
    Eligible For Limit Increase: [${limit.isEligibleForLimitIncrease}]
    Dynamic: [${limit.isDynamic}]
    Scope Type: [${limit.scopeType}]
    Quota Support: [${limit.areQuotasSupported}]
    Resource Availability Support: [${limit.isResourceAvailabilitySupported}]\n`
        );
      }
    }
    serviceLimitsOverview = serviceLimitsOverview.concat(`${"=".repeat(64)}\n`);
  }
  if (filePath) {
    outputToFile(filePath, serviceLimitsOverview);
    return;
  }
  console.log(serviceLimitsOverview);
};
