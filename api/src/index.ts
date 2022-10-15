import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import { getServiceLimits } from "./services/getServiceLimits";
import { Region } from "oci-common";
import { outputServiceLimits } from "./utils/outputServiceLimits";
import type {
  CheckboxHash,
  Compartment,
  LimitDefinitionsMap,
  RegionSubscription,
  ServiceSummary,
} from "./types/types";
import { listServices } from "./services/listServices";

(async () => {
  try {
    dotenv.config();

    const app: Express = express();
    // app.use(...) runs on every single request
    app.use(cors());
    app.use(express.json());
    const port = process.env["PORT"];
    const tenancyId = process.env["TENANCY_ID"]!;
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
    let serviceSubscriptions: ServiceSummary[] = [];

    app.listen(port, async () => {
      compartments = compartments.concat(
        await listCompartments(tenancyId, true)
      );
      regionSubscriptions = regionSubscriptions.concat(
        await listRegionSubscriptions(tenancyId)
      );
      serviceSubscriptions = serviceSubscriptions.concat(
        await listServices(tenancyId)
      );
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
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
      res.status(200).send(JSON.stringify(data));
    });
  } catch (error) {
    console.log("Error executing example" + error);
  } finally {
    console.debug("DONE");
  }
})();
