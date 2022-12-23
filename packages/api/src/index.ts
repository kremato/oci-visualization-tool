import express, { Express, Request, response, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import { listServices } from "./services/listServices";
import { common } from "oci-sdk";
import { getLimitDefinitions } from "./services/getLimitDefinitions";
import { Provider } from "./clients/provider";
import type { ResponseTreeNode } from "common";
import path from "path";
import type {
  CommonRegion,
  Token,
  LimitDefinitionsPerProperty,
  ServiceLimitMap,
  MyLimitValueSummary,
} from "./types/types";
import type {
  IdentityCompartment,
  RegionSubscription,
  ServiceSummary,
  InputData,
  MyLimitDefinitionSummary,
} from "common";

import { loadLimit } from "./services/loadLimit";
import { outputToFile } from "./utils/outputToFile";
import { Cache } from "./services/cache";
import { listServiceLimitsPerService } from "./services/listServiceLimitsPerService";
import { sortLimitsRotateScopes } from "./utils/sortLimitsRotateScopes";
import type { Compartment } from "oci-identity/lib/model";
import { createResponseTreeNode } from "./utils/createResponseTreeNode";

try {
  dotenv.config();
  const app: Express = express();
  app.use(cors());
  app.use(express.json());
  const port = process.env["PORT"];
  const tenancyId = Provider.getInstance().provider.getTenantId();
  let token: Token = { count: 0 };

  let compartments: IdentityCompartment[] = [];
  let regionSubscriptions: RegionSubscription[] = [];
  let regions: CommonRegion[] = [];
  let serviceSubscriptions: ServiceSummary[] = [];
  let limitDefinitionsPerLimitName: LimitDefinitionsPerProperty = new Map();
  const limitDefinitionsPerRegionPerService: Map<
    common.Region,
    Map<string, MyLimitDefinitionSummary[]>
  > = new Map();
  const serviceLimitMap: ServiceLimitMap = new Map();

  app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    compartments = await listCompartments(tenancyId, true);
    regionSubscriptions = await listRegionSubscriptions(tenancyId);
    serviceSubscriptions = await listServices(tenancyId);
    serviceSubscriptions = serviceSubscriptions.filter(
      (service) =>
        !["cloud-shell", "cost-management", "dashboard", "regions"].includes(
          service.name
        )
    );
    regions = common.Region.values().filter((region) =>
      regionSubscriptions.some((item) => item.regionName === region.regionId)
    );
    limitDefinitionsPerLimitName = (await getLimitDefinitions(
      "perLimitName"
    )) as LimitDefinitionsPerProperty;

    for (const region of regions) {
      limitDefinitionsPerRegionPerService.set(
        region,
        (await getLimitDefinitions(
          "perServiceName",
          region
        )) as LimitDefinitionsPerProperty
      );
    }
    console.log("[server]: App.use() finished");
  });

  app.get("/compartments", async (_req: Request, res: Response) => {
    res.status(200).send(JSON.stringify(compartments));
  });

  app.get("/regions", async (_req: Request, res: Response) => {
    res.status(200).send(JSON.stringify(regionSubscriptions));
  });

  app.get("/services", async (_req: Request, res: Response) => {
    res.status(200).send(JSON.stringify(serviceSubscriptions));
  });

  app.get("/limits", async (_req: Request, res: Response) => {
    const responseLimitDefinitionsPerLimitName = Object.create(null);
    for (const [key, value] of limitDefinitionsPerLimitName.entries()) {
      responseLimitDefinitionsPerLimitName[key] = value;
    }
    res.status(200).send(JSON.stringify(responseLimitDefinitionsPerLimitName));
  });

  app.post("/limits", async (req: Request, res: Response) => {
    // TODO: validation
    const data = req.body as InputData;
    console.log("[/limits]");
    console.log(data);

    const initialPostLimitsCount = token.count;
    token.count += 1;
    const newRequest = token.count != initialPostLimitsCount + 1;

    if (data.invalidateCache) {
      Cache.getInstance().clear();
    }

    const filteredCompartments = compartments.filter((compartment) => {
      return data.compartments.includes(compartment.id);
    });
    const filteredRegions = regions.filter((region) => {
      return data.regions.includes(region.regionId);
    });
    const filteredServices = serviceSubscriptions.filter((service) => {
      return data.services.includes(service.name);
    });

    const rootCompartmentTree = createResponseTreeNode("rootCompartments");
    const rootServiceTree = createResponseTreeNode("rootServices");
    const loadLimitArgumetns: [
      Compartment,
      common.Region,
      MyLimitDefinitionSummary,
      ResponseTreeNode,
      ResponseTreeNode,
      MyLimitValueSummary[]
    ][] = [];
    for (const compartment of filteredCompartments) {
      for (const region of filteredRegions) {
        for (const service of filteredServices) {
          // TODO: maybe for service limits it would be better if they were a map, where limit name is a key to service limits, so later we would not have to filter them with O(n)
          let limitDefinitionSummaries = limitDefinitionsPerRegionPerService
            .get(region)
            ?.get(service.name);

          if (!limitDefinitionSummaries) {
            console.log(
              `[${path.basename(
                __filename
              )}]: limitDefinitionsPerService.get(region)?.get(service.name) returned undefined`
            );
            continue;
          }

          if (data.limits.length > 0) {
            limitDefinitionSummaries = limitDefinitionSummaries.filter(
              (limit) =>
                /* data.limits.includes(limit.name) */
                data.limits.some(
                  (item) =>
                    item.limitName === limit.name &&
                    item.serviceName === limit.serviceName
                )
            );
          }

          if (
            !serviceLimitMap.has(service.name) &&
            token.count === initialPostLimitsCount + 1
          )
            serviceLimitMap.set(
              service.name,
              await listServiceLimitsPerService(service.name)
            );

          if (newRequest) break;

          for (const LimitDefinitionSummary of limitDefinitionSummaries) {
            loadLimitArgumetns.push([
              compartment,
              region,
              LimitDefinitionSummary,
              rootCompartmentTree,
              rootServiceTree,
              serviceLimitMap.get(service.name)!,
            ]);
          }
        }
      }
    }

    while (loadLimitArgumetns.length > 0) {
      const promises = loadLimitArgumetns
        .splice(0, 15)
        .map((item) => loadLimit(...item));
      await Promise.all(promises);
      if (newRequest) {
        res.status(409).send([]);
        return;
      }
    }

    sortLimitsRotateScopes(rootCompartmentTree);
    sortLimitsRotateScopes(rootServiceTree);
    const responseData = JSON.stringify([rootCompartmentTree, rootServiceTree]);

    newRequest ? res.status(409).send([]) : res.status(200).send(responseData);
    outputToFile("test/postLimitsResponse.txt", responseData);
  });

  app.use((_req, res) => {
    res.status(404).send("NOT FOUND");
  });
} catch (error) {
  console.log("Error executing" + error);
} finally {
  console.debug("DONE");
}
