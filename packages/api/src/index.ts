import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  configuration,
  compartments,
  regions,
  services,
  limits,
} from "./controllers";
import path from "path";

const filePath = path.basename(__filename);

try {
  dotenv.config();
  const app: Express = express();
  app.use(cors());
  app.use(express.json());
  const port = process.env["PORT"];

  app.listen(port, configuration.onStart);

  app.get("/compartments", compartments.list);
  app.get("/region-subscriptions", regions.listRegionSubscriptions);
  app.get("/services", services.list);
  app.get("/limits", limits.list);
  app.post("/limits", limits.store);

  app.use((_req, res) => {
    res.status(404).send("NOT FOUND");
  });
} catch (error) {
  console.log(`[${filePath}]: Error executing`);
  console.log(error);
} finally {
  console.debug("DONE");
}
