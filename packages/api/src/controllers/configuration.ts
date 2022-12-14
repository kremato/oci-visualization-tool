import { common } from "oci-sdk";
import { Cache } from "../services/cache";
import { getLimitDefinitions } from "../services/getLimitDefinitions";
import { listCompartments } from "../services/listCompartments";
import { listRegionSubscriptions } from "../services/listRegionSubscriptions";
import { listServices } from "../services/listServices";
import type { LimitDefinitionsPerProperty } from "../types/types";

export const onStart = async (): Promise<void> => {
  console.log(`⚡️[server]: Server is running`);
  const cache = Cache.getInstance();

  cache.compartments = await listCompartments();
  cache.regionSubscriptions = await listRegionSubscriptions();
  cache.serviceSubscriptions = (await listServices()).filter(
    (service) =>
      !["cloud-shell", "cost-management", "dashboard", "regions"].includes(
        service.name
      )
  );
  cache.regions = common.Region.values().filter((region) =>
    cache.regionSubscriptions.some(
      (item) => item.regionName === region.regionId
    )
  );
  cache.limitDefinitionsPerLimitName = (await getLimitDefinitions(
    "perLimitName"
  )) as LimitDefinitionsPerProperty;

  for (const region of cache.regions) {
    cache.limitDefinitionsPerRegionPerService.set(
      region,
      (await getLimitDefinitions(
        "perServiceName",
        region
      )) as LimitDefinitionsPerProperty
    );
  }
  console.log("[server]: App.use() finished");
};
