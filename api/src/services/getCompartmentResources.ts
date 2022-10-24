import type { LimitDefinitionSummary } from "oci-limits/lib/model";
import type { bool } from "yup";
import { getIdentityClient } from "../clients/getIdentityClient";
import { getLimitsClient } from "../clients/getLimitsClient";
import { Provider } from "../clients/provider";
import type {
  CommonRegion,
  Compartment,
  Foo,
  LimitDefinitionsMap,
  LimitDefinitionsPerScope,
} from "../types/types";
import { getAvailibilityDomainsPerRegion } from "./getAvailibilityDomainsPerRegion";
import { getResourceAvailabilityAD, getResourceAvailabilityRegion } from "./getResourceAvailibility";

export const getCompartmentResources = async (
  compartment: Compartment,
  region: CommonRegion,
  limitDefinitionsPerScope: LimitDefinitionsPerScope,
  scopeFilter: (scope: string) => boolean,
  serviceFilter: (serviceName: string) => boolean
) => {
  const identityClient = getIdentityClient(Provider.getInstance().provider);
  const limitsClient = getLimitsClient();
  limitsClient.region = region;

  const foo: Foo = new Map<
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
  const availabilityDomains = await getAvailibilityDomainsPerRegion(
    identityClient
  );
  for (let [scope, serviceDefinitionMap] of limitDefinitionsPerScope) {
    if (scopeFilter(scope)) continue;
    for (const [serviceName, limitDefinitions] of serviceDefinitionMap) {
      if (serviceFilter(serviceName)) continue;
      foo.set(serviceName, new Map());
      for (const limitDefinitionSummary of limitDefinitions) {
        const limitADsMap = foo.get(serviceName)!;
        console.log(`Limit: ${limitDefinitionSummary.name}\n`)
        limitADsMap.set(limitDefinitionSummary, []);
        for (const availabilityDomain of availabilityDomains) {
          const resourceAvailability = await getResourceAvailabilityAD(
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
          console.log(`\t${
            availabilityDomain.name
          }${" ".repeat(32)} available: ${
            available
          }${" ".repeat(12)} | used: ${resourceAvailability.used}${" ".repeat(
            12
          )} | quota: ${quota}\n`)
        }
      }
    }
  }
  return foo;
};
