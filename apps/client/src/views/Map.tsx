import { observer } from "mobx-react-lite";

import { TrackingObject, Map } from "../components";
import { trackingStore } from "../stores/trackingStore";

const position: [number, number] = [48.46820202247146, 35.06348145187649];

export const MapView = observer(() => {
  const { trackingObjects, lostObjects } = trackingStore;

  return (
    <Map position={position}>
      {trackingObjects?.map((obj) => (
        <TrackingObject key={obj.id} object={obj} />
      ))}
      {lostObjects?.map((obj) => (
        <TrackingObject key={obj.id} object={obj} />
      ))}
    </Map>
  );
});
