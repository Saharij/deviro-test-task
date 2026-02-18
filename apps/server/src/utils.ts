import type { TrackingObject, Coords } from "@shared/types";

import { EARTH_RADIUS_KM } from "./constants";

export function getActiveTrackingObjects(trackingObjects: TrackingObject[]) {
  return trackingObjects.filter(
    (trackingObject) => trackingObject.status === "active",
  );
}

export function getDistanceKm(from: Coords, to: Coords) {
  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;

  const angularDistance =
    2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return EARTH_RADIUS_KM * angularDistance;
}

export function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}
