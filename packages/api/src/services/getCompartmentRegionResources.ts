
import { getIdentityClient } from "../clients/getIdentityClient";
import { getLimitsClient } from "../clients/getLimitsClient";
import { Provider } from "../clients/provider";
import type {
  CommonRegion,
  Compartment,
  LimitDefinitionsPerScope,
  RegionServicesObject,
  ResourceObjectRegion,
  ResourceObjectAD,
} from "../types/types";
import { getAvailibilityDomainsPerRegion } from "./getAvailibilityDomainsPerRegion";
import {
  getResourceAvailabilityAD,
  getResourceAvailabilityRegion,
} from "./getResourceAvailibility";
import { outputToFile } from "./outputToFile";

export const getCompartmentRegionResources = async (
  compartment: Compartment,
  region: CommonRegion,
  limitDefinitionsPerScope: LimitDefinitionsPerScope,
  scopeFilter: (scope: string) => boolean,
  serviceFilter: (serviceName: string) => boolean
): Promise<RegionServicesObject> => {
  const identityClient = getIdentityClient(Provider.getInstance().provider);
  const limitsClient = getLimitsClient();
  limitsClient.region = region;

  const regionServicesObject: RegionServicesObject = {
    aDScope: new Map(),
    regionScope: new Map(),
  };
  const availabilityDomains = await getAvailibilityDomainsPerRegion(
    identityClient
  );
  let logFormattedOutput = "";
  for (let [scope, serviceLimitMap] of limitDefinitionsPerScope) {
    // if (scopeFilter(scope)) continue;
    if (scope === "GLOBAL") continue;
    logFormattedOutput += `Scope: ${scope}\n`;
    for (const [serviceName, limitDefinitions] of serviceLimitMap) {
      if (!["compute"].includes(serviceName)) continue;
      logFormattedOutput += `\tService: ${serviceName}\n`;
      if (scope === "AD") {
        const aDScopeMap = regionServicesObject.aDScope;
        aDScopeMap.set(serviceName, []);

        for (const limitDefinitionSummary of limitDefinitions) {
          const serviceResourceObject: ResourceObjectAD = {
            resourceName: limitDefinitionSummary.name,
            availibilityDomain: [],
          };
          logFormattedOutput += `\t\tResource: ${limitDefinitionSummary.name}\n`;
          for (const availabilityDomain of availabilityDomains) {
            const resourceAvailability = await getResourceAvailabilityAD(
              limitsClient,
              compartment.id,
              limitDefinitionSummary,
              availabilityDomain
            );

            if (!resourceAvailability) continue;
            const available =
              resourceAvailability.available?.toString() || "undefined";
            const used = resourceAvailability.used?.toString() || "undefined";
            const quota =
              resourceAvailability.effectiveQuotaValue?.toString() ||
              "undefined";

            serviceResourceObject.availibilityDomain.push({
              name: availabilityDomain.name,
              available,
              used,
              quota,
            });
            logFormattedOutput += `\t\t\t${availabilityDomain.name}${" ".repeat(
              32
            )} available: ${available}${" ".repeat(12)} | used: ${
              resourceAvailability.used
            }${" ".repeat(12)} | quota: ${quota}\n`;
          }
          aDScopeMap.get(serviceName)?.push(serviceResourceObject);
        }
      }
      if (scope == "REGION") {
        const serviceResourceMap = regionServicesObject.regionScope;
        serviceResourceMap.set(serviceName, []);
        const resourceList = serviceResourceMap.get(serviceName)!;
        for (const limitDefinitionSummary of limitDefinitions) {
          const resourceObject: ResourceObjectRegion = {
            resourceName: limitDefinitionSummary.name,
            available: "",
            used: "",
          };

          const resourceAvailability = await getResourceAvailabilityRegion(
            limitsClient,
            compartment.id,
            limitDefinitionSummary
          );

          if (!resourceAvailability) continue;

          const available =
            resourceAvailability.available?.toString() || "undefined";
          const used = resourceAvailability.used?.toString() || "undefined";

          resourceObject.available = available;
          resourceObject.used = used;
          logFormattedOutput += `\t\tResource: ${
            limitDefinitionSummary.name
          }${" ".repeat(32)} available: ${available}${" ".repeat(12)} | used: ${
            resourceAvailability.used
          }\n`;
          resourceList.push(resourceObject);
        }
      }
    }
  }
  outputToFile("test/getCompartmentsRegionResources.txt", logFormattedOutput);
  return regionServicesObject;
};
