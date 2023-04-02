import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
//import * as controllers from "./controllers";
import { WebSocketServer } from "ws";
import * as url from "url";
import {
  configuration,
  compartments,
  limits,
  regions,
  services,
} from "./controllers";

dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());

const httpServer = app.listen(process.env["PORT"], configuration.onStart);
const wss = new WebSocketServer({
  server: httpServer,
});

wss.on("connection", (ws, req) => {
  console.log(`Received a new connection from the client`);

  if (!req.url) {
    ws.close(1008);
    return;
  }

  const { token } = url.parse(req.url, true).query;

  if (
    !token ||
    Array.isArray(token) ||
    configuration.registeredClients.has(token)
  ) {
    ws.close(1008);
    return;
  }

  configuration.registeredClients.set(token, ws);
});

app.get("/registration-token", configuration.onSignup);
app.get("/compartments", compartments.list);
app.get("/region-subscriptions", regions.listRegionSubscriptions);
app.get("/services", services.list);
app.get("/limits", limits.list);
app.post("/limits/:id", limits.store);
app.get("/", configuration.onPing);
app.use((_req, res) => {
  res.status(404).send("NOT FOUND");
});
