import { MapContainer, TileLayer } from "react-leaflet";

interface MapProps {
  children: React.ReactNode;
  position: [number, number];
}

export function Map({ children, position }: MapProps) {
  return (
    <MapContainer
      center={position}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
