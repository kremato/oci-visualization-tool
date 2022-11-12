import {
  ScopeObject,
  ResourceDataAD,
  ResourceDataRegion,
  StringHash,
  Names,
  ResourceDataGlobal,
} from "common";
import { getLimitsClient } from "../clients/getLimitsClient";
import type {
  CommonRegion,
  LimitDefinitionsPerScope,
  Token,
} from "../types/types";
import { getAvailibilityDomainsPerRegion } from "./getAvailibilityDomainsPerRegion";
import { getResourceAvailability } from "./getResourceAvailibility";
import { outputToFile } from "../utils/outputToFile";
import path from "path";
import { Provider } from "../clients/provider";

export const getServiceResourcesPerScope = async (
  compartmentId: string,
  region: CommonRegion,
  limitDefinitionsPerScope: LimitDefinitionsPerScope,
  serviceName: string,
  requestedScopes: string[],
  regionServicesObject: ScopeObject,
  initialPostLimitsCount: number,
  token: Token,
  globalHash: StringHash<ResourceDataGlobal[]>
): Promise<void> => {
  const limitsClient = getLimitsClient();
  limitsClient.region = region;

  const availabilityDomains = await getAvailibilityDomainsPerRegion(region);
  let logFormattedOutput = "";
  const aDScopeHash: StringHash<ResourceDataAD[]> = Object.create(null);
  const serviceResourceHash: StringHash<ResourceDataRegion[]> =
    Object.create(null);
  const globalServiceResourceHash: StringHash<ResourceDataGlobal[]> =
    Object.create(null);
  for (let [scope, serviceLimitMap] of limitDefinitionsPerScope) {
    if (!requestedScopes.includes(scope)) continue;
    console.log(scope);
    logFormattedOutput += `Scope: ${scope}\n`;
    const limitDefinitions = serviceLimitMap.get(serviceName);
    // if there is no service with a given name in current scope, continue
    if (!limitDefinitions) continue;
    console.log(serviceName);
    logFormattedOutput += `\tService: ${serviceName}\n`;
    if (scope === Names.AD) {
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
          /* const resourceAvailability = await getResourceAvailabilityAD(
            limitsClient,
            compartmentId,
            limitDefinitionSummary,
            availabilityDomain
          ); */
          const resourceAvailability = await getResourceAvailability(
            limitsClient,
            compartmentId,
            limitDefinitionSummary,
            availabilityDomain
          );

          if (!resourceAvailability) continue;
          const available = resourceAvailability.available?.toString() || "n/a";
          const used = resourceAvailability.used?.toString() || "n/a";
          const quota =
            resourceAvailability.effectiveQuotaValue?.toString() || "n/a";

          serviceResourceObject.availibilityDomainList.push({
            aDName: availabilityDomain.name,
            available,
            used,
            quota,
          });
          logFormattedOutput += `\t\t\t${availabilityDomain.name}${" ".repeat(
            32
          )} available: ${available}${" ".repeat(
            12
          )} | used: ${used}${" ".repeat(12)} | quota: ${quota}\n`;
        }

        aDScopeHash[serviceName]!.push(serviceResourceObject);
      }
    }
    if (scope == Names.Region.toUpperCase()) {
      const resourceList: ResourceDataRegion[] = [];
      for (const limitDefinitionSummary of limitDefinitions) {
        const resourceDataRegion: ResourceDataRegion = {
          resourceName: limitDefinitionSummary.name,
          available: "",
          used: "",
          quota: "",
        };

        if (token.postLimitsCount != initialPostLimitsCount + 1) {
          console.log(
            `[${path.basename(__filename)}]: new request detected, aborting`
          );
          return;
        }
        const resourceAvailability = await getResourceAvailability(
          limitsClient,
          compartmentId,
          limitDefinitionSummary
        );

        if (!resourceAvailability) continue;
        resourceAvailability.effectiveQuotaValue;
        const available = resourceAvailability.available?.toString() || "n/a";
        const used = resourceAvailability.used?.toString() || "n/a";
        const quota =
          resourceAvailability.effectiveQuotaValue?.toString() || "n/a";

        resourceDataRegion.available = available;
        resourceDataRegion.used = used;
        resourceDataRegion.quota = quota;
        logFormattedOutput += `\t\tResource: ${
          limitDefinitionSummary.name
        }${" ".repeat(32)} available: ${available}${" ".repeat(
          12
        )} | used: ${used}${" ".repeat(12)} | qouta: ${quota}\n`;
        resourceList.push(resourceDataRegion);
      }
      serviceResourceHash[serviceName] = resourceList;
    }
    if (scope == Names.Global.toUpperCase()) {
      const resourceList: ResourceDataGlobal[] = [];
      for (const limitDefinitionSummary of limitDefinitions) {
        const resourceDataGlobal: ResourceDataGlobal = {
          resourceName: limitDefinitionSummary.name,
          available: "",
          used: "",
          quota: "",
        };

        const resourceAvailability = await getResourceAvailability(
          limitsClient,
          Provider.getInstance().provider.getTenantId(),
          limitDefinitionSummary
        );

        if (!resourceAvailability) continue;
        resourceAvailability.effectiveQuotaValue;
        const available = resourceAvailability.available?.toString() || "n/a";
        const used = resourceAvailability.used?.toString() || "n/a";
        const quota =
          resourceAvailability.effectiveQuotaValue?.toString() || "n/a";

        resourceDataGlobal.available = available;
        resourceDataGlobal.used = used;
        resourceDataGlobal.quota = quota;
        logFormattedOutput += `\t\tResource: ${
          limitDefinitionSummary.name
        }${" ".repeat(32)} available: ${available}${" ".repeat(
          12
        )} | used: ${used}${" ".repeat(12)} | qouta: ${quota}\n`;
        resourceList.push(resourceDataGlobal);
      }
      globalServiceResourceHash[serviceName] = resourceList;
    }
  }

  if (requestedScopes.includes(Names.AD)) {
    for (const service of Object.keys(aDScopeHash)) {
      regionServicesObject.aDScopeHash[service] = aDScopeHash[service]!;
    }
  }
  if (requestedScopes.includes(Names.Region.toUpperCase())) {
    for (const service of Object.keys(serviceResourceHash)) {
      regionServicesObject.regionScopeHash[service] =
        serviceResourceHash[service]!;
    }
  }
  if (requestedScopes.includes(Names.Global.toUpperCase())) {
    for (const service of Object.keys(globalServiceResourceHash)) {
      globalHash[service] = globalServiceResourceHash[service]!;
    }
  }
  outputToFile("test/getCompartmentsRegionResources.txt", logFormattedOutput);
};
