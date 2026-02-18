import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Box, styled } from "@mui/material";

import { trackingStore } from "../stores";
import { ObjectStatistics } from "../components";

export const StatisticsView = observer(() => {
  const { trackingObjects, lostObjects } = trackingStore;
  const [statisticOpen, setStatisticOpen] = useState(false);

  if (statisticOpen) {
    return (
      <ObjectStatistics
        active={trackingObjects?.length}
        lost={lostObjects?.length}
        onClose={() => setStatisticOpen(false)}
      />
    );
  }

  return (
    <Button onClick={() => setStatisticOpen(true)}>Статистика об'єктів</Button>
  );
});

const Button = styled(Box)({
  position: "absolute",
  bottom: "20px",
  left: "20px",
  padding: "5px 10px",
  backgroundColor: "rgba(211, 211, 211, 0.85)",
  color: "#000000",
  borderRadius: "5px",
  cursor: "pointer",
  zIndex: 999,
});
