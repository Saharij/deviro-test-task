import { type TrackingObject } from "@shared/types";

import { spawnObjects, SPAWN_CONFIG } from "./utils";

export function spawnInitialObjects(trackingObjects: TrackingObject[]) {
  spawnObjects(
    trackingObjects,
    SPAWN_CONFIG.INITIAL_SPAWN_COUNT,
    SPAWN_CONFIG.INITIAL_SPAWN_COUNT,
  );
}

export const spawnInterval = (trackingObjects: TrackingObject[]) =>
  setInterval(() => {
    spawnObjects(
      trackingObjects,
      SPAWN_CONFIG.CONTINUOUS_SPAWN_BATCH,
      SPAWN_CONFIG.MAX_OBJECTS_COUNT,
    );
  }, 6000);
