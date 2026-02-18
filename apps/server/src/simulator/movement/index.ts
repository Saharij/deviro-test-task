import { type TrackingObject } from "@shared/types";

import { moveObjects } from "./utils";
import { checkDangerZones } from "../status-handler/utils";
import { dangerZoneMap } from "../../constants";

export const movementInterval = (trackingObjects: TrackingObject[]) =>
  setInterval(() => {
    moveObjects(trackingObjects);
    checkDangerZones(trackingObjects, dangerZoneMap);
  }, 2000);
