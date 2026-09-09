import { Paper, Skeleton, Stack } from "@mui/material";
import { PATIENT_PROFILE_TEXT } from "@/views/patientProfile/PatientProfileText";

export function PatientProfileSkeleton() {
  return (
    <Paper
      variant="outlined"
      role="status"
      aria-label={PATIENT_PROFILE_TEXT.loading}
      aria-live="polite"
      aria-busy="true"
    >
      <Stack spacing={3} sx={{ p: { xs: 3, sm: 4 } }}>
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={48} />
      </Stack>
    </Paper>
  );
}
