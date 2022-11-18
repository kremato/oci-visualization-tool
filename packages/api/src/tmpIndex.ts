import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import { listServices } from "./services/listServices";
import { common, limits } from "oci-sdk";
import { getLimitDefinitions } from "./services/getLimitDefinitions";
import { Provider } from "./clients/provider";
import { getServiceResourcesPerScope } from "./services/getServiceResourcesPerScope";
import type { Names, Nested, ResourceDataGlobal, StringHash } from "common";
import path from "path";
import type {
  CommonRegion,
  LimitDefinitionsPerScope,
  ServiceLimits,
  Token,
} from "./types/types";
import type {
  LimitDefinitionsPerProperty,
  IdentityCompartment,
  RegionSubscription,
  ServiceSummary,
  CompartmentsHash,
  CompartmentData,
  ScopeObject,
  InputData,
} from "common";
import {
  createCompartmentDataObject,
  createServiceScopeObject,
} from "./services/createCompartmentDataObject";
import { loadLimit } from "./services/loadLimit";

(async () => {
  try {
    dotenv.config();
    const app: Express = express();
    app.use(cors());
    app.use(express.json());
    const port = process.env["PORT"];
    const tenancyId = Provider.getInstance().provider.getTenantId();
    let token: Token = { postLimitsCount: 0 };

    let compartments: IdentityCompartment[] = [];
    let regionSubscriptions: RegionSubscription[] = [];
    let regions: CommonRegion[] = [];
    let serviceSubscriptions: ServiceSummary[] = [];
    let limitDefinitionsPerLimitName: LimitDefinitionsPerProperty =
      Object.create(null);
    let limitDefinitionsPerService = new Map<
      common.Region,
      StringHash<limits.models.LimitDefinitionSummary[]>
    >();
    // const serviceLimits: ServiceLimits = new Map();
    const compartmentHash: CompartmentsHash = Object.create(null);

    app.listen(port, async () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
      compartments = compartments.concat(
        await listCompartments(tenancyId, true)
      );
      regionSubscriptions = regionSubscriptions.concat(
        await listRegionSubscriptions(tenancyId)
      );
      serviceSubscriptions = serviceSubscriptions.concat(
        await listServices(tenancyId)
      );
      regions = common.Region.values().filter((region) =>
        regionSubscriptions.some((item) => item.regionName === region.regionId)
      );
      limitDefinitionsPerLimitName = (await getLimitDefinitions(
        "perLimitName"
      )) as LimitDefinitionsPerProperty;

      for (const region of regions) {
        limitDefinitionsPerService.set(
          region,
          (await getLimitDefinitions(
            "perServiceName",
            region
          )) as LimitDefinitionsPerProperty
        );
        /* serviceLimits.set(
          region,
          (await getLimitDefinitions(
            "perScope",
            region
          )) as LimitDefinitionsPerScope
        ); */
      }
      // fill compartmentHash with compartments and regions
      for (const compartment of compartments) {
        const compartmentData: CompartmentData = Object.create(null);
        compartmentData["compartmentName"] = compartment.name;
        compartmentData["regions"] = Object.create(null);
        if (compartment.id === tenancyId) {
          compartmentData["global"] = Object.create(null);
        }
        compartmentHash[compartment.id] = compartmentData;
        for (const region of regions) {
          const regionServicesObject: ScopeObject = Object.create(null);
          regionServicesObject["aDScopeHash"] = Object.create(null);
          regionServicesObject["regionScopeHash"] = Object.create(null);
          compartmentData.regions[region.regionId] = regionServicesObject;
        }
      }
      console.log("[server]: App.use() finished");
    });

    app.get("/compartments", async (req: Request, res: Response) => {
      res.status(200).send(JSON.stringify(compartments));
    });

    app.get("/regions", async (req: Request, res: Response) => {
      res.status(200).send(JSON.stringify(regionSubscriptions));
    });

    app.get("/services", async (req: Request, res: Response) => {
      res.status(200).send(JSON.stringify(serviceSubscriptions));
    });

    app.get("/limits", async (req: Request, res: Response) => {
      res.status(200).send(JSON.stringify(limitDefinitionsPerLimitName));
    });

    app.post("/limits", async (req: Request, res: Response) => {
      // TODO: validation
      const data = req.body as InputData;
      console.log("[/limits]");
      console.log(data);

      const initialPostLimitsCount = token.postLimitsCount;
      token.postLimitsCount += 1;
      const newRequest = token.postLimitsCount != initialPostLimitsCount + 1;

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
      const rootCompartments: Nested = Object.create(null);
      rootCompartments["name"] = "root";
      rootCompartments["children"] = [];
      rootCompartments["isRoot"] = true;
      const rootServices: Nested = Object.create(null);
      rootServices["name"] = "root";
      rootServices["children"] = [];
      rootServices["isRoot"] = true;
      for (const compartment of filteredCompartments) {
        for (const region of filteredRegions) {
          for (const service of filteredServices) {
            // TODO: maybe for service limits it would be better if they were a map where limit name is a key to service limits, so later we would not have to filter them with O(n)
            let serviceLimits =
              limitDefinitionsPerService.get(region)?.[service.name];
            if (!serviceLimits) {
              console.log(
                `[${path.basename(
                  __filename
                )}]: limitDefinitionsPerService.get(region)?.[service.name] returned undefined`
              );
              continue;
            }
            if (data.limits.length > 0) {
              serviceLimits = serviceLimits.filter((limit) =>
                data.limits.includes(limit.name!)
              );
            }

            for (const LimitDefinitionSummary of serviceLimits) {
              promises.push(
                loadLimit(
                  compartment.compartmentId,
                  region,
                  LimitDefinitionSummary,
                  initialPostLimitsCount,
                  token,
                  rootCompartments,
                  rootServices
                )
              );
            }
          }
        }
      }

      // TODO:
      /*
      if (data.seq) {
        for (const promise of promises) {
          await promise()
        }
      } else {
        ...
      }
       */

      await Promise.all(promises);

      if (newRequest) {
        res.status(409).send("");
        return;
      }

      const responseData = JSON.stringify({ rootCompartments, rootServices });
      console.log(responseData);
      if (newRequest) {
        res.status(409).send("");
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
