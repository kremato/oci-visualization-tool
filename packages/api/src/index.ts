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
import WebSocket, { WebSocketServer } from "ws";

dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());

export let socket: WebSocket.WebSocket | undefined = undefined;
const httpServer = app.listen(process.env["PORT"], configuration.onStart);
const wss = new WebSocketServer({
  server: httpServer,
});

wss.on("connection", (ws) => {
  console.log(`Received a new connection from the client`);
  if (socket) socket.close();
  socket = ws;
});
wss.on("close", () => {
  socket = undefined;
});

app.get("/compartments", compartments.list);
app.get("/region-subscriptions", regions.listRegionSubscriptions);
app.get("/services", services.list);
app.get("/limits", limits.list);
app.post("/limits", limits.store);
app.use((_req, res) => {
  res.status(404).send("NOT FOUND");
});
