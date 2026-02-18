import { CircleMarker, Popup } from "react-leaflet";
import { Box, styled, Typography } from "@mui/material";
import { type TrackingObject } from "@shared/types";

const blue = "#1e90ff";
const red = "#ed2939";
const labels: Record<string, string> = {
  id: "Ідентифікатор",
  status: "Статус",
  lat: "Широта",
  lng: "Довгота",
  targetCity: "Напрямок",
  lastUpdate: "Останнє оновлення",
  lost: "Втрачений",
  active: "Активний",
};

export function TrackingObject({ object }: { object: TrackingObject }) {
  const { id, lat, lng, status, lastUpdate, targetCity } = object;

  return (
    <CircleMarker
      center={[lat, lng]}
      radius={5}
      color={status === "lost" ? red : blue}
    >
      <Popup>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <PopupItem label={labels.id} value={id} />
          <PopupItem
            label={labels.status}
            value={labels[status].toUpperCase()}
          />
          <PopupItem label={labels.lat} value={lat} />
          <PopupItem label={labels.lng} value={lng} />
          <PopupItem label={labels.targetCity} value={targetCity} />
          <PopupItem
            label={labels.lastUpdate}
            value={new Date(lastUpdate).toLocaleTimeString()}
          />
        </Box>
      </Popup>
    </CircleMarker>
  );
}

const PopupItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <PopupTypography>
      <b>{label}:</b> {value}
    </PopupTypography>
  );
};

const PopupTypography = styled(Typography)({
  lineHeight: "22px",
  fontSize: "14px",
  margin: "unset !important",
});
