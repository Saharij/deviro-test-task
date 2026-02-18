import type { Coords, TrackingObject } from "@shared/types";

import { getDistanceKm } from "../../utils";

const DANGER_ZONE_EFFECTIVE_RADIUS_KM = 10;
const OBJECT_LOSS_PROBABILITY = 0.09;
const LOST_REMOVAL_TIMEOUT_MS = 5 * 60 * 1000;
const LOST_RECOVERY_PROBABILITY = 0.1;

export function checkDangerZones(
  trackingObjects: TrackingObject[],
  dangerZones: Record<string, Coords>,
  now = Date.now(),
  getRandomValue: () => number = Math.random,
) {
  for (const trackingObject of trackingObjects) {
    if (trackingObject.status !== "active") {
      continue;
    }

    const isAtRisk = isObjectAtRisk(trackingObject, dangerZones);

    if (!isAtRisk) {
      continue;
    }

    if (getRandomValue() < OBJECT_LOSS_PROBABILITY) {
      trackingObject.status = "lost";
      trackingObject.lastUpdate = now;
    }
  }
}

export function handleLostRecovery(
  trackingObjects: TrackingObject[],
  now = Date.now(),
  getRandomValue: () => number = Math.random,
) {
  return trackingObjects.filter((trackingObject) => {
    if (trackingObject.status !== "lost") {
      return true;
    }

    if (now - trackingObject.lastUpdate >= LOST_REMOVAL_TIMEOUT_MS) {
      return false;
    }

    if (getRandomValue() < LOST_RECOVERY_PROBABILITY) {
      trackingObject.status = "active";
      trackingObject.lastUpdate = now;
    }

    return true;
  });
}

function isWithinRadiusKm(from: Coords, to: Coords, radiusKm: number) {
  return getDistanceKm(from, to) <= radiusKm;
}

function isObjectAtRisk(
  trackingObject: TrackingObject,
  dangerZones: Record<string, Coords>,
  riskRadiusKm = DANGER_ZONE_EFFECTIVE_RADIUS_KM,
) {
  const objectCoords: Coords = {
    lat: trackingObject.lat,
    lng: trackingObject.lng,
  };

  return Object.values(dangerZones).some((zoneCoords) =>
    isWithinRadiusKm(objectCoords, zoneCoords, riskRadiusKm),
  );
}
