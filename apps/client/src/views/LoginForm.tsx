import { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";

import { authStore } from "../stores/authStore";

export const LoginFormView = observer(() => {
  const [password, setPassword] = useState("");

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (
    event,
  ) => {
    event.preventDefault();
    await authStore.login(password);
  };

  return (
    <Container>
      <Paper
        component="form"
        elevation={3}
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 380,
          p: 3,
          gap: 2,
        }}
      >
        <Typography variant="h5">Login</Typography>
        <TextField
          autoFocus
          fullWidth
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
        {authStore.errorMessage ? (
          <Alert severity="error">{authStore.errorMessage}</Alert>
        ) : null}
        <Button
          disabled={authStore.isSubmitting}
          type="submit"
          variant="contained"
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  );
});

const Container = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100vw",
  height: "100vh",
});
