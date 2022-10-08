import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getProvider } from "./clients/getProvider";
import { listCompartments } from "./listCompartments";
import { Clients } from "./clients/clients";
import cors from "cors";

dotenv.config();

const app: Express = express();
app.use(cors());
const port = process.env["PORT"];
const tenancyId = process.env["TENANCY_ID"]!;
const clients = Clients.getInstance();

app.get("/compartments", async (req: Request, res: Response) => {
  const compartments = await listCompartments(
    tenancyId,
    clients.identityClient,
    true
  );
  res.status(200).send(JSON.stringify(compartments));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
