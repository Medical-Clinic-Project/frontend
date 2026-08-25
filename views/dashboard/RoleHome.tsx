"use client";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME_TEXT } from "@/views/dashboard/RoleHomeText";
import { useLogout } from "@/views/dashboard/useLogout";

export function RoleHome() {
  const { user } = useAuth();
  const { isLoggingOut, logout, logoutError } = useLogout();

  return (
    <Container maxWidth="md" sx={{ display: "flex", flex: 1, width: "100%" }}>
      <Stack
        spacing={3}
        sx={{ minHeight: "100dvh", justifyContent: "center" }}
      >
        {logoutError && <Alert severity="error">{logoutError}</Alert>}

        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography component="strong" color="primary.main">
                  {user?.role} {ROLE_HOME_TEXT.workspaceSuffix}
                </Typography>
                <Typography component="h1" variant="h2">
                  {ROLE_HOME_TEXT.welcomePrefix} {user?.fullName}
                </Typography>
                <Typography color="text.secondary">
                  {ROLE_HOME_TEXT.description}
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ justifyContent: "space-between" }}
              >
                <Typography variant="body2" color="text.secondary">
                  {ROLE_HOME_TEXT.signedInPrefix} {user?.email}
                </Typography>
                <Button
                  variant="outlined"
                  loading={isLoggingOut}
                  onClick={() => void logout()}
                >
                  {ROLE_HOME_TEXT.signOut}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
