export interface Coords {
  lat: number;
  lng: number;
}

export interface TrackingObject {
  id: string;
  lat: number;
  lng: number;
  direction: Coords;
  targetCity: string;
  visitedCities: string[];
  status: "active" | "lost";
  lastUpdate: number;
}
