import type { ScopeObject, ResourceDataAD, ResourceDataRegion } from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import type { CommonRegion, LimitDefinitionsPerScope } from "../types/types";
import { getAvailibilityDomainsPerRegion } from "./getAvailibilityDomainsPerRegion";
import {
  getResourceAvailabilityAD,
  getResourceAvailabilityRegion,
} from "./getResourceAvailibility";
import { outputToFile } from "../utils/outputToFile";

export const getCompartmentRegionResources = async (
  compartmentId: string,
  region: CommonRegion,
  limitDefinitionsPerScope: LimitDefinitionsPerScope,
  serviceName: string,
  requestedScopes: string[],
  regionServicesObject: ScopeObject
): Promise<ScopeObject> => {
  const limitsClient = getLimitsClient();
  limitsClient.region = region;

  const availabilityDomains = await getAvailibilityDomainsPerRegion(region);
  let logFormattedOutput = "";
  for (let [scope, serviceLimitMap] of limitDefinitionsPerScope) {
    // if (scopeFilter(scope)) continue;
    if (!requestedScopes.includes(scope)) continue;
    console.log(scope);
    logFormattedOutput += `Scope: ${scope}\n`;
    const limitDefinitions = serviceLimitMap.get(serviceName);
    // if there is no service with that name in current scope, continue
    if (!limitDefinitions) continue;
    console.log(serviceName);
    logFormattedOutput += `\tService: ${serviceName}\n`;
    if (scope === "AD") {
      const aDScopeHash = regionServicesObject.aDScopeHash;
      aDScopeHash[serviceName] = [];

      for (const limitDefinitionSummary of limitDefinitions) {
        /* console.log(
          "Name: " +
            limitDefinitionSummary.name +
            "; ServiceName: " +
            limitDefinitionSummary.serviceName
        ); */
        const serviceResourceObject: ResourceDataAD = {
          resourceName: limitDefinitionSummary.name,
          availibilityDomainList: [],
        };
        logFormattedOutput += `\t\tResource: ${limitDefinitionSummary.name}\n`;
        for (const availabilityDomain of availabilityDomains) {
          /* console.log("\tAD: " + availabilityDomain.name); */
          const resourceAvailability = await getResourceAvailabilityAD(
            limitsClient,
            compartmentId,
            limitDefinitionSummary,
            availabilityDomain
          );

          if (!resourceAvailability) continue;
          const available =
            resourceAvailability.available?.toString() || "undefined";
          const used = resourceAvailability.used?.toString() || "undefined";
          const quota =
            resourceAvailability.effectiveQuotaValue?.toString() || "undefined";

          serviceResourceObject.availibilityDomainList.push({
            aDName: availabilityDomain.name,
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
        aDScopeHash[serviceName]?.push(serviceResourceObject);
      }
    }
    if (scope == "REGION") {
      const serviceResourceHash = regionServicesObject.regionScopeHash;
      const resourceList: ResourceDataRegion[] = [];
      serviceResourceHash[serviceName] = resourceList;
      for (const limitDefinitionSummary of limitDefinitions) {
        const resourceObject: ResourceDataRegion = {
          resourceName: limitDefinitionSummary.name,
          available: "",
          used: "",
        };

        const resourceAvailability = await getResourceAvailabilityRegion(
          limitsClient,
          compartmentId,
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
    //}
  }
  outputToFile("test/getCompartmentsRegionResources.txt", logFormattedOutput);
  return regionServicesObject;
};

/* export const getCompartmentRegionResources = async (
  compartmentId: string,
  region: CommonRegion,
  limitDefinitionsPerScope: LimitDefinitionsPerScope,
  scopeFilter: (scope: string) => boolean,
  serviceFilter: (serviceName: string) => boolean
): Promise<RegionServicesObject> => {
  const identityClient = getIdentityClient(Provider.getInstance().provider);
  const limitsClient = getLimitsClient();
  limitsClient.region = region;

  const regionServicesObject: RegionServicesObject = {
    aDScope: Object.create(null),
    regionScope: Object.create(null),
  };
  const availabilityDomains = await getAvailibilityDomainsPerRegion(
    identityClient
  );
  let logFormattedOutput = "";
  for (let [scope, serviceLimitMap] of limitDefinitionsPerScope) {
    // if (scopeFilter(scope)) continue;
    if (scope === "GLOBAL") continue;
    console.log(scope);
    logFormattedOutput += `Scope: ${scope}\n`;
    for (const [serviceName, limitDefinitions] of serviceLimitMap) {
      if (!["compute"].includes(serviceName)) continue;
      console.log(serviceName);
      logFormattedOutput += `\tService: ${serviceName}\n`;
      if (scope === "AD") {
        const aDScopeHash = regionServicesObject.aDScope;
        aDScopeHash[serviceName] = [];

        for (const limitDefinitionSummary of limitDefinitions) {
          const serviceResourceObject: ResourceObjectAD = {
            resourceName: limitDefinitionSummary.name,
            availibilityDomain: [],
          };
          logFormattedOutput += `\t\tResource: ${limitDefinitionSummary.name}\n`;
          for (const availabilityDomain of availabilityDomains) {
            const resourceAvailability = await getResourceAvailabilityAD(
              limitsClient,
              compartmentId,
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
          aDScopeHash[serviceName]?.push(serviceResourceObject);
        }
      }
      if (scope == "REGION") {
        const serviceResourceHash = regionServicesObject.regionScope;
        const resourceList: ResourceObjectRegion[] = [];
        serviceResourceHash[serviceName] = resourceList;
        for (const limitDefinitionSummary of limitDefinitions) {
          const resourceObject: ResourceObjectRegion = {
            resourceName: limitDefinitionSummary.name,
            available: "",
            used: "",
          };

          const resourceAvailability = await getResourceAvailabilityRegion(
            limitsClient,
            compartmentId,
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
 */
