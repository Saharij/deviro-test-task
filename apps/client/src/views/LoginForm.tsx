import { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
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
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        component="form"
        elevation={3}
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
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
    </Box>
  );
});
