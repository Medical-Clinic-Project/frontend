import { Paper, Skeleton, Stack } from "@mui/material";
import { DOCTORS_TEXT } from "@/views/doctors/DoctorsText";

export function DoctorsDataGridSkeleton() {
  return (
    <Paper
      variant="outlined"
      role="status"
      aria-label={DOCTORS_TEXT.loading}
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
