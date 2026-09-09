import { Paper, Skeleton, Stack } from "@mui/material";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityText";

export function DoctorAvailabilityCalendarSkeleton() {
  return (
    <Paper
      variant="outlined"
      role="status"
      aria-label={DOCTOR_AVAILABILITY_TEXT.loading}
      aria-live="polite"
      aria-busy="true"
    >
      <Stack spacing={2} sx={{ p: { xs: 2, sm: 3 } }}>
        <Skeleton variant="rounded" height={48} />
        <Skeleton variant="rounded" height={96} />
        <Skeleton variant="rounded" height={320} />
      </Stack>
    </Paper>
  );
}
