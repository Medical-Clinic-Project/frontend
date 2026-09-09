import type { ReactNode } from "react";

import { Box, Stack } from "@mui/material";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { AdminNavigation } from "@/components/navigation/AdminNavigation";
import { PERMISSIONS } from "@/constants/accessControl";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PermissionGuard
      action={PERMISSIONS.accessAdminWorkspace.action}
      subject={PERMISSIONS.accessAdminWorkspace.subject}
    >
      <Stack direction={{ xs: "column", md: "row" }} sx={{ minHeight: "100dvh" }}>
        <AdminNavigation />
        <Box component="main" sx={{ minWidth: 0, flexGrow: 1 }}>
          {children}
        </Box>
      </Stack>
    </PermissionGuard>
  );
}
