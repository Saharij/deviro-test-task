import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Box, styled } from "@mui/material";

import { authStore, trackingStore } from "./stores";
import { wsService } from "./services";
import { MapView, StatisticsView, LoginFormView } from "./views";

export const App = observer(() => {
  const { isAuthenticated, token } = authStore;

  useEffect(() => {
    if (!token) {
      wsService.disconnect();
      trackingStore.reset();
      return;
    }

    wsService.connect(token, () => {
      authStore.logout();
      trackingStore.reset();
    });

    return () => {
      wsService.disconnect();
    };
  }, [token]);

  if (!isAuthenticated) {
    return <LoginFormView />;
  }

  return (
    <AppContainer>
      <StatisticsView />
      <MapView />
    </AppContainer>
  );
});

const AppContainer = styled(Box)({
  position: "relative",
  height: "100vh",
  width: "100vw",
});
