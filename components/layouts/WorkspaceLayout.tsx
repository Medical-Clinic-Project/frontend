import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface WorkspaceLayoutProps {
  children: ReactNode;
  navigation?: ReactNode;
}

export function WorkspaceLayout({
  children,
  navigation,
}: WorkspaceLayoutProps) {
  return (
    <Stack sx={{ minHeight: "100dvh" }}>
      {navigation}
      {children}
    </Stack>
  );
}
