import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import type {
  CheckboxHash,
  CommonRegion,
  Compartment,
  CompartmentToRegions,
  LimitDefinitionsPerScope,
  RegionSubscription,
  ServiceLimits,
  ServiceSummary,
  ResourceObjectAD,
} from "./types/types";
import { listServices } from "./services/listServices";
import { common } from "oci-sdk";
import { getServiceLimits } from "./services/getServiceLimits";
import { Provider } from "./clients/provider";
import { getCompartmentRegionResources } from "./services/getCompartmentRegionResources";

(async () => {
  try {
    dotenv.config();
    const app: Express = express();
    // app.use(...) runs on every single request
    app.use(cors());
    app.use(express.json());
    const port = process.env["PORT"];
    //const tenancyId = process.env["TENANCY_ID"]!;
    const tenancyId = Provider.getInstance().provider.getTenantId();
    /* const serviceLimitDefinitions = await getServiceLimits(
      Region.CA_MONTREAL_1,
      tenancyId
    );
    outputServiceLimits(
      serviceLimitDefinitions as LimitDefinitionsMap,
      "serviceLimits.txt",
      true
    ); */
    let compartments: Compartment[] = [];
    let regionSubscriptions: RegionSubscription[] = [];
    let regions: CommonRegion[] = [];
    let serviceSubscriptions: ServiceSummary[] = [];
    const serviceLimits: ServiceLimits = new Map();

    app.listen(port, async () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
      compartments = compartments.concat(
        await listCompartments(tenancyId, true)
      );
      console.log(await listRegionSubscriptions(tenancyId));
      console.log(common.Region.values());
      regionSubscriptions = regionSubscriptions.concat(
        await listRegionSubscriptions(tenancyId)
      );
      serviceSubscriptions = serviceSubscriptions.concat(
        await listServices(tenancyId)
      );
      regions = common.Region.values().filter((region) =>
        regionSubscriptions.some((item) => item.regionName === region.regionId)
      );
      // This can become a bottleneck
      console.log("before");
      for (const region of regions) {
        serviceLimits.set(
          region,
          (await getServiceLimits(region, true)) as LimitDefinitionsPerScope
        );
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

    app.post("/limits", async (req: Request, res: Response) => {
      // TODO: validation
      const data = req.body as CheckboxHash;

      const filteredCompartments = compartments.filter((compartment) => {
        return data.compartments[compartment.id];
      });
      const filterdRegions = regions.filter((region) => {
        return data.regions[region.regionId];
      });

      const compartmentToRegions: CompartmentToRegions = new Map();
      for (const compartment of filteredCompartments) {
        compartmentToRegions.set(compartment, new Map());
        for (const region of filterdRegions) {
          const limits = serviceLimits.get(region);
          const regionToScope = compartmentToRegions.get(compartment)!;
          const regionServicesObject = await getCompartmentRegionResources(
            compartment,
            region,
            limits!,
            (scope: string) => {
              return scope !== "AD";
            },
            (serviceName: string) => {
              return serviceName !== "compute";
            }
          );
          regionToScope.set(region, regionServicesObject);
        }
      }

      const responseData = JSON.stringify(compartmentToRegions, function replacer(key, value) {
        if (value instanceof Map) {
          return {
            dataType: "Map",
            value: Array.from(value.entries()),
          };
        } else {
          return value;
        }
      });
      res.status(200).send(responseData);
    });
  } catch (error) {
    console.log("Error executing" + error);
  } finally {
    console.debug("DONE");
  }
})();
