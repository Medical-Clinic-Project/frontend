import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { AppointmentStatusChip } from "@/components/appointments/AppointmentStatusChip";
import { APPOINTMENT_DETAILS_DIALOG_TEXT } from "@/components/dialogs/AppointmentDetailsDialog.text";
import type { Appointment } from "@/types/appointment";
import { formatDateTimeRange } from "@/utils/doctorAvailability/dateTime";

interface AppointmentDetailsDialogProps {
  open: boolean;
  appointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void | Promise<void>;
}

export function AppointmentDetailsDialog({
  open,
  appointment,
  isLoading,
  error,
  onClose,
  onRetry,
}: AppointmentDetailsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{APPOINTMENT_DETAILS_DIALOG_TEXT.title}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Stack
            spacing={2}
            role="status"
            aria-label={APPOINTMENT_DETAILS_DIALOG_TEXT.loading}
            aria-live="polite"
            aria-busy="true"
          >
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
          </Stack>
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => void onRetry()}>
                {APPOINTMENT_DETAILS_DIALOG_TEXT.retry}
              </Button>
            }
          >
            {error}
          </Alert>
        ) : appointment ? (
          <Stack spacing={2.5}>
            <AppointmentDetailField
              label={APPOINTMENT_DETAILS_DIALOG_TEXT.doctorLabel}
              value={appointment.doctorName}
            />
            <AppointmentDetailField
              label={APPOINTMENT_DETAILS_DIALOG_TEXT.departmentLabel}
              value={appointment.departmentName}
            />
            <AppointmentDetailField
              label={APPOINTMENT_DETAILS_DIALOG_TEXT.appointmentTimeLabel}
              value={formatDateTimeRange(appointment.startTime, appointment.endTime)}
            />
            <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
              <Typography variant="caption" color="text.secondary">
                {APPOINTMENT_DETAILS_DIALOG_TEXT.statusLabel}
              </Typography>
              <AppointmentStatusChip status={appointment.status} />
            </Stack>
            <AppointmentDetailField
              label={APPOINTMENT_DETAILS_DIALOG_TEXT.reasonLabel}
              value={appointment.reason || APPOINTMENT_DETAILS_DIALOG_TEXT.notProvided}
            />
            <AppointmentDetailField
              label={APPOINTMENT_DETAILS_DIALOG_TEXT.notesLabel}
              value={appointment.notes || APPOINTMENT_DETAILS_DIALOG_TEXT.notProvided}
            />
          </Stack>
        ) : (
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={() => void onRetry()}>
                {APPOINTMENT_DETAILS_DIALOG_TEXT.retry}
              </Button>
            }
          >
            {APPOINTMENT_DETAILS_DIALOG_TEXT.unavailable}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          {APPOINTMENT_DETAILS_DIALOG_TEXT.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AppointmentDetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ overflowWrap: "anywhere" }}>{value}</Typography>
    </Stack>
  );
}
