import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { DoctorNavigation } from "@/components/navigation/DoctorNavigation";
import { PERMISSIONS } from "@/constants/accessControl";

import type { ReactNode } from "react";
import { Box, Stack } from "@mui/material";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard
      action={PERMISSIONS.accessDoctorWorkspace.action}
      subject={PERMISSIONS.accessDoctorWorkspace.subject}
    >
      <Stack direction={{ xs: "column", md: "row" }} sx={{ minHeight: "100dvh" }}>
        <DoctorNavigation />
        <Box component="main" sx={{ minWidth: 0, flexGrow: 1 }}>
          {children}
        </Box>
      </Stack>
    </PermissionGuard>
  );
}
