import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { listCompartments } from "./services/listCompartments";
import cors from "cors";
import { listRegionSubscriptions } from "./services/listRegionSubscriptions";
import { getServiceLimits } from "./services/getServiceLimits";
import { Region } from "oci-common";
import { outputServiceLimits } from "./utils/outputServiceLimits";
import type { LimitDefinitionsMap } from "./types/types";
import { listServices } from "./services/listServices";

(async () => {
  try {
    dotenv.config();

    const app: Express = express();
    app.use(cors());
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

    app.get("/compartments", async (req: Request, res: Response) => {
      const compartments = await listCompartments(tenancyId, true);
      res.status(200).send(JSON.stringify(compartments));
    });

    app.get("/regions", async (req: Request, res: Response) => {
      const regions = await listRegionSubscriptions(tenancyId);
      res.status(200).send(JSON.stringify(regions));
    });

    app.get("/services", async (req: Request, res: Response) => {
      const services = await listServices(tenancyId);
      res.status(200).send(JSON.stringify(services));
    });

    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error executing example" + error);
  } finally {
    console.debug("DONE");
  }
})();
