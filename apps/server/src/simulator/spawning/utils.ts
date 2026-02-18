import { randomUUID } from "crypto";
import type { Coords, TrackingObject } from "@shared/types";

import { getNearestCityFromList } from "../city-routing";
import { toRadians, toDegrees } from "../../utils";
import { citiesMap, allCityNames, EARTH_RADIUS_KM } from "../../constants";

const SPAWN_RADIUS_KM = 600;
const INITIAL_SPAWN_COUNT = 60;
const CONTINUOUS_SPAWN_BATCH = 4;
const MAX_OBJECTS_COUNT = 200;

export function spawnObjects(
  trackingObjects: TrackingObject[],
  amountToAdd: number,
  maxObjectsCount = MAX_OBJECTS_COUNT,
) {
  const availableSlots = maxObjectsCount - trackingObjects.length;

  if (availableSlots <= 0) {
    return;
  }

  const objectCount = Math.min(amountToAdd, availableSlots);

  for (let index = 0; index < objectCount; index += 1) {
    const spawnPoint = getRandomPointWithinRadius(
      citiesMap.Dnipro,
      SPAWN_RADIUS_KM,
    );

    const targetCity = getNearestCityName(spawnPoint);

    if (!targetCity) {
      return;
    }

    trackingObjects.push(
      createTrackingObject(spawnPoint, targetCity, citiesMap[targetCity]),
    );
  }
}

function getNearestCityName(origin: Coords) {
  return getNearestCityFromList(origin, allCityNames);
}

function getRandomPointWithinRadius(center: Coords, radiusKm: number): Coords {
  const distanceKm = Math.sqrt(Math.random()) * radiusKm;
  const bearing = Math.random() * 2 * Math.PI;
  const angularDistance = distanceKm / EARTH_RADIUS_KM;

  const centerLatRad = toRadians(center.lat);
  const centerLngRad = toRadians(center.lng);

  const latRad = Math.asin(
    Math.sin(centerLatRad) * Math.cos(angularDistance) +
      Math.cos(centerLatRad) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const lngRad =
    centerLngRad +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(centerLatRad),
      Math.cos(angularDistance) - Math.sin(centerLatRad) * Math.sin(latRad),
    );

  return {
    lat: toDegrees(latRad),
    lng: ((toDegrees(lngRad) + 540) % 360) - 180,
  };
}

function createTrackingObject(
  spawnPoint: Coords,
  targetCity: string,
  targetCoords: Coords,
) {
  return {
    id: randomUUID(),
    lat: spawnPoint.lat,
    lng: spawnPoint.lng,
    direction: targetCoords,
    targetCity,
    visitedCities: [],
    status: "active",
    lastUpdate: Date.now(),
  } satisfies TrackingObject;
}

export const SPAWN_CONFIG = {
  INITIAL_SPAWN_COUNT,
  CONTINUOUS_SPAWN_BATCH,
  MAX_OBJECTS_COUNT,
} as const;
