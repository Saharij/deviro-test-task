import type { Coords, TrackingObject } from "@shared/types";

import { selectNextCity } from "../city-routing";
import { getDistanceKm, toRadians, toDegrees } from "../../utils";
import { citiesMap, EARTH_RADIUS_KM } from "../../constants";

const ARRIVAL_THRESHOLD_KM = 1;
const MOVEMENT_STEP_KM = 1.5;

export function moveObjects(
  trackingObjects: TrackingObject[],
  now = Date.now(),
) {
  for (const trackingObject of trackingObjects) {
    if (trackingObject.status !== "active") {
      continue;
    }

    const { lat, lng, direction, visitedCities, targetCity } = trackingObject;
    const currentPosition: Coords = { lat, lng };

    if (!direction) {
      updateTargetCity(trackingObject);
      continue;
    }

    let distanceToTarget = getDistanceKm(currentPosition, direction);

    if (distanceToTarget <= ARRIVAL_THRESHOLD_KM) {
      if (!visitedCities.includes(targetCity)) {
        trackingObject.visitedCities.push(targetCity);
      }

      updateTargetCity(trackingObject);
      distanceToTarget = getDistanceKm(
        currentPosition,
        citiesMap[trackingObject.targetCity],
      );
    }

    const nextTargetCoords = citiesMap[trackingObject.targetCity];
    const bearing = getBearing(currentPosition, nextTargetCoords);

    const nextPosition =
      distanceToTarget <= MOVEMENT_STEP_KM
        ? nextTargetCoords
        : moveByDistance(currentPosition, bearing, MOVEMENT_STEP_KM);

    trackingObject.lat = nextPosition.lat;
    trackingObject.lng = nextPosition.lng;
    trackingObject.direction = nextTargetCoords;
    trackingObject.lastUpdate = now;
  }
}

function getBearing(from: Coords, to: Coords) {
  const fromLatRad = toRadians(from.lat);
  const toLatRad = toRadians(to.lat);
  const lngDeltaRad = toRadians(to.lng - from.lng);

  const y = Math.sin(lngDeltaRad) * Math.cos(toLatRad);
  const x =
    Math.cos(fromLatRad) * Math.sin(toLatRad) -
    Math.sin(fromLatRad) * Math.cos(toLatRad) * Math.cos(lngDeltaRad);

  const bearing = toDegrees(Math.atan2(y, x));

  return (bearing + 360) % 360;
}

function moveByDistance(
  from: Coords,
  bearingDegrees: number,
  distanceKm: number,
): Coords {
  const angularDistance = distanceKm / EARTH_RADIUS_KM;
  const bearingRad = toRadians(bearingDegrees);
  const fromLatRad = toRadians(from.lat);
  const fromLngRad = toRadians(from.lng);

  const nextLatRad = Math.asin(
    Math.sin(fromLatRad) * Math.cos(angularDistance) +
      Math.cos(fromLatRad) * Math.sin(angularDistance) * Math.cos(bearingRad),
  );

  const nextLngRad =
    fromLngRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(fromLatRad),
      Math.cos(angularDistance) - Math.sin(fromLatRad) * Math.sin(nextLatRad),
    );

  return {
    lat: toDegrees(nextLatRad),
    lng: ((toDegrees(nextLngRad) + 540) % 360) - 180,
  };
}

function updateTargetCity(trackingObject: TrackingObject) {
  const nextCityName = selectNextCity(trackingObject);
  if (!nextCityName) {
    return;
  }

  trackingObject.targetCity = nextCityName;
  trackingObject.direction = citiesMap[nextCityName];
}
