import { Paper, Skeleton, Stack } from "@mui/material";
import { APPOINTMENT_SLOT_SELECTOR_TEXT } from "@/components/appointments/AppointmentSlotSelector.text";

export function AppointmentSlotSelectorSkeleton() {
  return (
    <Paper
      variant="outlined"
      role="status"
      aria-label={APPOINTMENT_SLOT_SELECTOR_TEXT.loading}
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
