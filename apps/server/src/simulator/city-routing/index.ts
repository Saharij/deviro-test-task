import { type Coords, type TrackingObject } from "@shared/types";

import { getDistanceKm } from "../../utils";
import { citiesMap, allCityNames } from "../../constants";

export function getNearestCityFromList(origin: Coords, cityNames: string[]) {
  let nearestCityName = cityNames[0];
  let nearestDistance = Infinity;

  for (const cityName of cityNames) {
    const cityCoords = citiesMap[cityName];
    const distance = getDistanceKm(origin, cityCoords);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCityName = cityName;
    }
  }

  return nearestCityName;
}

export function selectNextCity(trackingObject: TrackingObject) {
  const currentPosition: Coords = {
    lat: trackingObject.lat,
    lng: trackingObject.lng,
  };

  const unvisitedCities = allCityNames.filter(
    (cityName) =>
      !trackingObject.visitedCities.includes(cityName) &&
      cityName !== trackingObject.targetCity,
  );

  if (unvisitedCities.length > 0) {
    return getNearestCityFromList(currentPosition, unvisitedCities);
  }

  trackingObject.visitedCities = [];

  const reusableCities = allCityNames.filter(
    (cityName) => cityName !== trackingObject.targetCity,
  );

  return getNearestCityFromList(currentPosition, reusableCities);
}
