import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as controllers from "./controllers";
import { WebSocketServer } from "ws";
import * as url from "url";
import { checkRegistrationToken } from "./middleware/checkRegistrationToken";
import { validateStoreLimitsBody } from "./middleware/validateStoreLimitsBody";
import { emitClosingSession } from "./middleware/emitClosingSession";
import { checkProfileQuery } from "./middleware/checkProfileQuery";

dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());

const httpServer = app.listen(
  process.env["PORT"],
  controllers.configuration.start
);

app.get("/registration-token", controllers.configuration.signup);
app.get("/profiles", controllers.profiles.list);
app.get(
  "/profiles/status",
  checkProfileQuery,
  controllers.profiles.profileStatus
);
app.get("/compartments", checkProfileQuery, controllers.compartments.list);
app.get(
  "/region-subscriptions",
  checkProfileQuery,
  controllers.regions.listRegionSubscriptions
);
app.get("/services", checkProfileQuery, controllers.services.list);
app.get("/limits", checkProfileQuery, controllers.limits.list);
app.post(
  "/limits/:id",
  checkRegistrationToken,
  checkProfileQuery,
  validateStoreLimitsBody,
  emitClosingSession,
  controllers.limits.store
);
app.use((_, res) => {
  res.status(404).send("NOT FOUND");
});

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
    !controllers.configuration.registeredClients.has(token)
  ) {
    ws.close(1008);
    return;
  }

  controllers.configuration.registeredClients.set(token, ws);
});
