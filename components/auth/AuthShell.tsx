import { Container, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface AuthShellProps {
  brand: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ brand, title, subtitle, children }: AuthShellProps) {
  return (
    <Container maxWidth="sm">
      <Stack
        sx={{
          minHeight: "100dvh",
          justifyContent: "center",
          py: { xs: 4, sm: 6 },
        }}
      >
        <Paper
          component="main"
          sx={{
            width: "100%",
            p: { xs: 3, sm: 5 },
            border: 1,
            borderColor: "divider",
          }}
        >
          <Stack spacing={4}>
            <Stack spacing={1} sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary.main">
                {brand}
              </Typography>
              <Typography component="h1" variant="h2">
                {title}
              </Typography>
              <Typography color="text.secondary">{subtitle}</Typography>
            </Stack>
            {children}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
