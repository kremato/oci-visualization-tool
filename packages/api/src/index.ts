import express, { Express, Request, response, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import { listServices } from "./services/listServices";
import { common } from "oci-sdk";
import { getLimitDefinitions } from "./services/getLimitDefinitions";
import { Provider } from "./clients/provider";
import type { ResponseTree } from "common";
import path from "path";
import type {
  CommonRegion,
  Token,
  LimitDefinitionsPerProperty,
  ServiceLimitMap,
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

(async () => {
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
      res
        .status(200)
        .send(JSON.stringify(responseLimitDefinitionsPerLimitName));
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

      const promises: Promise<void>[] = [];
      const limitValuePromises: Promise<void>[] = [];
      const rootCompartmentTree: ResponseTree = Object.create(null);
      rootCompartmentTree["name"] = "rootCompartments";
      rootCompartmentTree["children"] = [];
      const rootServiceTree: ResponseTree = Object.create(null);
      rootServiceTree["name"] = "rootServices";
      rootServiceTree["children"] = [];
      for (const compartment of filteredCompartments) {
        for (const region of filteredRegions) {
          for (const service of filteredServices) {
            // TODO: maybe for service limits it would be better if they were a map, where limit name is a key to service limits, so later we would not have to filter them with O(n)
            let limitDefinitionSummaries = limitDefinitionsPerRegionPerService
              .get(region)
              ?.get(service.name);
            //let tmp = limitDefinitionsPerService.get(region);
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

            if (!serviceLimitMap.has(service.name))
              serviceLimitMap.set(
                service.name,
                await listServiceLimitsPerService(service.name)
              );

            for (const LimitDefinitionSummary of limitDefinitionSummaries) {
              const promise = loadLimit(
                compartment,
                region,
                LimitDefinitionSummary,
                initialPostLimitsCount,
                token,
                rootCompartmentTree,
                rootServiceTree,
                serviceLimitMap.get(service.name)!
              );

              promises.push(promise);
            }
            /* limitValuePromises.push(
              getServiceLimitValues(compartment.id, service.name)
            ); */
          }
        }
      }

      await Promise.all(promises);
      //await Promise.all(limitValuePromises);

      sortLimitsRotateScopes(rootCompartmentTree);
      sortLimitsRotateScopes(rootServiceTree);

      const responseData = JSON.stringify([
        rootCompartmentTree,
        rootServiceTree,
      ]);
      outputToFile("test/postLimitsResponse.txt", responseData);
      if (newRequest) {
        res.status(409).send([]);
        return;
      }
      res.status(200).send(responseData);
    });
  } catch (error) {
    console.log("Error executing" + error);
  } finally {
    console.debug("DONE");
  }
})();
