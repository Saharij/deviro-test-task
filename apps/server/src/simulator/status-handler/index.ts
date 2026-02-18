import { type TrackingObject } from "@shared/types";

import { handleLostRecovery } from "./utils";

export const recoveryInterval = (trackingObjects: TrackingObject[]) =>
  setInterval(() => {
    trackingObjects = handleLostRecovery(trackingObjects);
  }, 10000);
