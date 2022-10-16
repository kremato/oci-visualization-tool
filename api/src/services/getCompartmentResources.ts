import type { LimitDefinitionSummary } from "oci-limits/lib/model";
import { getIdentityClient } from "../clients/getIdentityClient";
import { getLimitsClient } from "../clients/getLimitsClient";
import { Provider } from "../clients/provider";
import type {
  CommonRegion,
  Compartment,
  LimitDefinitionsMap,
  LimitDefinitionsPerScope,
} from "../types/types";
import { getAvailibilityDomainsPerRegion } from "./getAvailibilityDomainsPerRegion";
import { getResourceAvailability } from "./getResourceAvailibility";

export const getCompartmentResources = async (
  compartment: Compartment,
  region: CommonRegion,
  limitDefinitionsPerScope: LimitDefinitionsPerScope,
  filter: (scope: string) => boolean
) => {
  const identityClient = getIdentityClient(Provider.getInstance().provider);
  const limitsClient = getLimitsClient();
  limitsClient.region = region;

  const foo = new Map<
    string,
    Map<
      LimitDefinitionSummary,
      {
        name: string | undefined;
        available: number;
        used: number;
        quota: number;
      }[]
    >
  >();
  for (let [scope, serviceDefinitionMap] of limitDefinitionsPerScope) {
    if (filter(scope)) continue;
    for (const [serviceName, limitDefinitions] of serviceDefinitionMap) {
      foo.set(serviceName, new Map());
      for (const limitDefinitionSummary of limitDefinitions) {
        const availabilityDomains = await getAvailibilityDomainsPerRegion(
          identityClient
        );
        const limitADsMap = foo.get(serviceName)!;
        limitADsMap.set(limitDefinitionSummary, []);
        for (const availabilityDomain of availabilityDomains) {
          const resourceAvailability = await getResourceAvailability(
            limitsClient,
            compartment.id,
            availabilityDomain,
            limitDefinitionSummary
          );

          if (!resourceAvailability) continue;

          const available = resourceAvailability.available || 0;
          const used = resourceAvailability.used || 0;
          const quota = resourceAvailability.effectiveQuotaValue || 0;

          const object = {
            name: availabilityDomain.name,
            available,
            used,
            quota,
          };
          limitADsMap.get(limitDefinitionSummary)?.push(object);
        }
      }
    }
  }
  return foo;
};
