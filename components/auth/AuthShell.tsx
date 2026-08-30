import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
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
      <Stack style={{ minHeight: "100dvh", justifyContent: "center" }}>
        <Card role="main">
          <CardContent>
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Typography align="center" variant="h4" color="primary.main">
                {brand}
              </Typography>
              <Typography align="center" component="h1" variant="h2">
                {title}
              </Typography>
              <Typography align="center" color="text.secondary">
                {subtitle}
              </Typography>
            </Stack>
            {children}
          </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
