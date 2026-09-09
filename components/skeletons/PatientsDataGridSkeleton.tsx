import { Paper, Skeleton, Stack } from "@mui/material";
import { PATIENTS_TEXT } from "@/views/patients/PatientsText";

export function PatientsDataGridSkeleton() {
  return (
    <Paper
      variant="outlined"
      role="status"
      aria-label={PATIENTS_TEXT.loading}
      aria-live="polite"
      aria-busy="true"
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Skeleton variant="rounded" height={64} />
        <Skeleton variant="rounded" height={64} />
        <Skeleton variant="rounded" height={64} />
      </Stack>
    </Paper>
  );
}
