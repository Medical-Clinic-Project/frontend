import { Box, Stack } from "@mui/material";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/constants/accessControl";
import { PatientNavigation } from "@/components/navigation/PatientNavigation";
import type { ReactNode } from "react";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard
      action={PERMISSIONS.accessPatientWorkspace.action}
      subject={PERMISSIONS.accessPatientWorkspace.subject}
    >
      <Stack direction={{ xs: "column", md: "row" }} sx={{ minHeight: "100dvh" }}>
        <PatientNavigation />
        <Box component="main" sx={{ minWidth: 0, flexGrow: 1 }}>
          {children}
        </Box>
      </Stack>
    </PermissionGuard>
  );
}
