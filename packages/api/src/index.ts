import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as controllers from "./controllers";
import { WebSocketServer } from "ws";
import * as url from "url";
import * as routes from "./routes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const httpServer = app.listen(
  process.env["PORT"],
  controllers.configuration.start
);

app.use("/registration-token", routes.registration.router);
app.use("/profiles", routes.profiles.router);
app.use("/compartments", routes.compartments.router);
app.use("/region-subscriptions", routes.regions.router);
app.use("/services", routes.services.router);
app.use("/limits", routes.limits.router);
app.use((_, res) => {
  res.status(404).send("NOT FOUND");
});

const wss = new WebSocketServer({
  server: httpServer,
});

wss.on("connection", (ws, req) => {
  console.log(`Received a new WS connection from the client`);

  if (!req.url) {
    ws.close(1008);
    return;
  }

  const { token } = url.parse(req.url, true).query;

  if (
    !token ||
    Array.isArray(token) ||
    !controllers.configuration.registeredClients.has(token)
  ) {
    ws.close(1008);
    return;
  }

  controllers.configuration.registeredClients.set(token, ws);
});
