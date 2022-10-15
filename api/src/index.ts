import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import type {
  CheckboxHash,
  CommonRegion,
  Compartment,
  IdentityRegion,
  LimitDefinitionsPerScope,
  RegionSubscription,
  ServiceLimits,
  ServiceSummary,
} from "./types/types";
import { listServices } from "./services/listServices";
import { listRegions } from "./services/listRegions";
import { common } from "oci-sdk";
import { getServiceLimits } from "./services/getServiceLimits";
import { Provider } from "./clients/provider";

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
        regionSubscriptions.some(
          (item) => item.regionKey === region.regionCode?.toUpperCase()
        )
      );

      // This can become a bottleneck
      console.log("before");
      const serviceLimits: ServiceLimits = new Map();
      for (const region of regions) {
        serviceLimits.set(
          region,
          (await getServiceLimits(
            region,
            tenancyId,
            true
          )) as LimitDefinitionsPerScope
        );
      }
      console.log("[Server]: App.use() finished");
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

    const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

    const a = async () => {
      await sleep(10000);
      console.log("a");
    };
    const b = async () => {
      await sleep();
      console.log("b");
    };
    const c = async () => {
      await sleep(6000);
      console.log("c");
    };
    app.post("/limits", async (req: Request, res: Response) => {
      // TODO: validation
      const data = req.body as CheckboxHash;
      //res.status(200).send(JSON.stringify(data));
      console.log("LIMITS");
      Promise.all([a(), b(), c()]);
    });
  } catch (error) {
    console.log("Error executing" + error);
  } finally {
    console.debug("DONE");
  }
})();
