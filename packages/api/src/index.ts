import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import type {
  InputData,
  CommonRegion,
  IdentityCompartment,
  CompartmentsHash,
  LimitDefinitionsPerScope,
  RegionSubscription,
  ServiceLimits,
  ServiceSummary,
  ResourceObjectAD,
  RegionsHash,
} from "./types/types";
import { listServices } from "./services/listServices";
import { common } from "oci-sdk";
import { getServiceLimits } from "./services/getServiceLimits";
import { Provider } from "./clients/provider";
import { getCompartmentRegionResources } from "./services/getCompartmentRegionResources";
import { replacer } from "./utils/replacer";

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
    let compartments: IdentityCompartment[] = [];
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
      const data = req.body as InputData;

      const filteredCompartments = compartments.filter((compartment) => {
        return data.compartments.includes(compartment.id);
      });
      const filterdRegions = regions.filter((region) => {
        return data.regions.includes(region.regionId);
      });

      const compartmentToRegions: CompartmentsHash = Object.create(null);
      for (const compartment of filteredCompartments) {
        const myCompartment: RegionsHash = Object.create(null);
        myCompartment.compartmentName = compartment.name;
        myCompartment.regions = Object.create(null);
        compartmentToRegions[compartment.id] = myCompartment;
        for (const region of filterdRegions) {
          const limits = serviceLimits.get(region);
          const regionToScope = compartmentToRegions[compartment.id]!;
          const regionServicesObject = await getCompartmentRegionResources(
            compartment.id,
            region,
            limits!,
            (scope: string) => {
              return scope !== "AD";
            },
            (serviceName: string) => {
              return serviceName !== "compute";
            }
          );
          regionToScope.regions[region.regionId] = regionServicesObject;
        }
      }

      const responseData = JSON.stringify(compartmentToRegions);
      console.log(responseData);
      res.status(200).send(responseData);
    });
  } catch (error) {
    console.log("Error executing" + error);
  } finally {
    console.debug("DONE");
  }
})();
