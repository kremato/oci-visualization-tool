import {
  ScopeObject,
  ResourceDataAD,
  ResourceDataRegion,
  StringHash,
  Names,
} from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import type {
  CommonRegion,
  LimitDefinitionsPerScope,
  Token,
} from "../types/types";
import { getAvailibilityDomainsPerRegion } from "./getAvailibilityDomainsPerRegion";
import {
  getResourceAvailabilityAD,
  getResourceAvailabilityRegion,
} from "./getResourceAvailibility";
import { outputToFile } from "../utils/outputToFile";
import path from "path";

export const getCompartmentRegionResources = async (
  compartmentId: string,
  region: CommonRegion,
  limitDefinitionsPerScope: LimitDefinitionsPerScope,
  serviceName: string,
  requestedScopes: string[],
  regionServicesObject: ScopeObject,
  initialPostLimitsCount: number,
  token: Token
): Promise<void> => {
  const limitsClient = getLimitsClient();
  limitsClient.region = region;

  const availabilityDomains = await getAvailibilityDomainsPerRegion(region);
  let logFormattedOutput = "";
  const aDScopeHash: StringHash<ResourceDataAD[]> = Object.create(null);
  const serviceResourceHash: StringHash<ResourceDataRegion[]> =
    Object.create(null);
  for (let [scope, serviceLimitMap] of limitDefinitionsPerScope) {
    if (!requestedScopes.includes(scope)) continue;
    console.log(scope);
    logFormattedOutput += `Scope: ${scope}\n`;
    const limitDefinitions = serviceLimitMap.get(serviceName);
    // if there is no service with that name in current scope, continue
    if (!limitDefinitions) continue;
    console.log(serviceName);
    logFormattedOutput += `\tService: ${serviceName}\n`;
    if (scope === "AD") {
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
          if (token.postLimitsCount != initialPostLimitsCount + 1) {
            console.log(
              `[${path.basename(__filename)}]: new request detected, aborting`
            );
            return;
          }
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

        aDScopeHash[serviceName]!.push(serviceResourceObject);
      }
    }
    if (scope == "REGION") {
      const resourceList: ResourceDataRegion[] = [];
      for (const limitDefinitionSummary of limitDefinitions) {
        const resourceObject: ResourceDataRegion = {
          resourceName: limitDefinitionSummary.name,
          available: "",
          used: "",
        };

        if (token.postLimitsCount != initialPostLimitsCount + 1) {
          console.log(
            `[${path.basename(__filename)}]: new request detected, aborting`
          );
          return;
        }
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
      serviceResourceHash[serviceName] = resourceList;
    }
  }

  // regionServicesObject = { aDScopeHash, regionScopeHash: serviceResourceHash };

  if (requestedScopes.includes(Names.AD)) {
    for (const [service, value] of Object.entries(aDScopeHash)) {
      regionServicesObject.aDScopeHash[service] = aDScopeHash[service]!;
    }
  }
  if (requestedScopes.includes(Names.Region.toUpperCase())) {
    for (const [service, value] of Object.entries(aDScopeHash)) {
      regionServicesObject.regionScopeHash[service] =
        serviceResourceHash[service]!;
    }
  }
  // regionServicesObject.aDScopeHash = aDScopeHash;
  outputToFile("test/getCompartmentsRegionResources.txt", logFormattedOutput);
  // return regionServicesObject;
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
