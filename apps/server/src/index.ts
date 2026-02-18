import { createServer } from "http";
import express from "express";
import { WebSocketServer } from "ws";

import { type TrackingObject } from "@shared/types";

import {
  movementInterval,
  spawnInterval,
  recoveryInterval,
  spawnInitialObjects,
} from "./simulator";
import { loginRouteHandler, isTokenValid } from "./auth";
import { getActiveTrackingObjects } from "./utils";

export let trackingObjects: TrackingObject[] = [];

const PORT = 3001;

const app = express();

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());
app.post("/login", loginRouteHandler);

const server = createServer(app);
const wss = new WebSocketServer({ server });

spawnInitialObjects(trackingObjects);

spawnInterval(trackingObjects);
movementInterval(trackingObjects);
recoveryInterval(trackingObjects);

process.on("SIGINT", () => {
  clearInterval(spawnInterval(trackingObjects));
  clearInterval(movementInterval(trackingObjects));
  clearInterval(recoveryInterval(trackingObjects));
  process.exit(0);
});
process.on("SIGTERM", () => {
  clearInterval(spawnInterval(trackingObjects));
  clearInterval(movementInterval(trackingObjects));
  clearInterval(recoveryInterval(trackingObjects));
  process.exit(0);
});

wss.on("connection", (ws, request) => {
  const requestUrl = new URL(
    request.url ?? "",
    `http://${request.headers.host ?? "localhost"}`,
  );
  const token = requestUrl.searchParams.get("token");

  if (!token || !isTokenValid(token)) {
    ws.close(1008, "Unauthorized");
    return;
  }

  ws.send(
    JSON.stringify({
      type: "INIT",
      payload: getActiveTrackingObjects(trackingObjects),
    }),
  );

  const interval = setInterval(() => {
    ws.send(
      JSON.stringify({
        type: "UPDATE",
        payload: getActiveTrackingObjects(trackingObjects),
      }),
    );
  }, 2000);

  ws.on("close", () => {
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
