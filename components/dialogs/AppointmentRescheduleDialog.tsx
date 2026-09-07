"use client";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { AppointmentSlotSelector } from "@/components/appointments/AppointmentSlotSelector";
import { APPOINTMENT_RESCHEDULE_DIALOG_TEXT } from "@/components/dialogs/AppointmentRescheduleDialogText";
import type { usePatientAvailability } from "@/hooks/usePatientAvailability";
import type { Appointment } from "@/types/appointment";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { formatDateTimeRange } from "@/utils/doctorAvailability/dateTime";

interface AppointmentRescheduleDialogProps {
  open: boolean;
  appointment: Appointment | null;
  availabilityState: ReturnType<typeof usePatientAvailability>;
  isRescheduling: boolean;
  onClose: () => void;
  onSelect: (availability: DoctorAvailability) => void;
}

export function AppointmentRescheduleDialog({
  open,
  appointment,
  availabilityState,
  isRescheduling,
  onClose,
  onSelect,
}: AppointmentRescheduleDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isRescheduling ? undefined : onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>{APPOINTMENT_RESCHEDULE_DIALOG_TEXT.title}</DialogTitle>
      <DialogContent>
        {appointment ? (
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Typography color="text.secondary">
              {APPOINTMENT_RESCHEDULE_DIALOG_TEXT.description}
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {APPOINTMENT_RESCHEDULE_DIALOG_TEXT.currentTimeLabel}
              </Typography>
              <Typography>
                {formatDateTimeRange(appointment.startTime, appointment.endTime)}
              </Typography>
            </Stack>
            <AppointmentSlotSelector
              availabilityState={availabilityState}
              onSelect={onSelect}
            />
          </Stack>
        ) : (
          <Alert severity="info">
            {APPOINTMENT_RESCHEDULE_DIALOG_TEXT.unavailable}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" disabled={isRescheduling} onClick={onClose}>
          {APPOINTMENT_RESCHEDULE_DIALOG_TEXT.cancel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
