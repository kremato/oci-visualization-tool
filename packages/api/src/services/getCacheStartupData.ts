import type { MyAvailabilityDomain } from "../types/types";
import { filterAvailabilityDomains } from "../utils/filterAvailabilityDomains";
import { filterLimitDefinitionSummaries } from "../utils/filterLimitsDefinitionSummaries";
import { filterServiceSummaries } from "../utils/filterServiceSummaries";
import { findGloballyScopedServices } from "../utils/findGlobalScopeServices";
import { getAvailabilityDomainsPerRegion } from "./getAvailabilityDomainsPerRegion";
import { getLimitDefinitionsPerProperty } from "./getLimitDefinitionsPerProperty";
import { listCompartments } from "./listCompartments";
import { listLimitDefinitionSummaries } from "./listLimitDefinitionSummaries";
import { listRegionSubscriptions } from "./listRegionSubscriptions";
import { listServices } from "./listServices";

export const getCacheStartupData = async (profile: string) => {
  const compartments = await listCompartments(profile);
  const regionSubscriptions = await listRegionSubscriptions(profile);
  const limiDefinitionSummaries = await listLimitDefinitionSummaries(profile);
  const globallyScopedServices = findGloballyScopedServices(
    limiDefinitionSummaries
  );
  const services = (
    await filterServiceSummaries(await listServices(profile))
  ).filter((service) => !globallyScopedServices.includes(service.name));

  const limitDefinitionsPerLimitName = getLimitDefinitionsPerProperty(
    await filterLimitDefinitionSummaries(limiDefinitionSummaries),
    "name"
  );
  const limitDefinitionsPerService = getLimitDefinitionsPerProperty(
    await filterLimitDefinitionSummaries(limiDefinitionSummaries),
    "serviceName"
  );
  const availabilityDomainsPerRegion: Map<string, MyAvailabilityDomain[]> =
    new Map();
  regionSubscriptions.forEach(async (region) => {
    availabilityDomainsPerRegion.set(
      region.regionName,
      await filterAvailabilityDomains(
        await getAvailabilityDomainsPerRegion(profile, region)
      )
    );
  });

  return {
    compartments,
    regionSubscriptions,
    services,
    limitDefinitionsPerLimitName,
    limitDefinitionsPerService,
    availabilityDomainsPerRegion,
  };
};
