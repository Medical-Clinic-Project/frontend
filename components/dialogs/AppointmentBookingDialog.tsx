"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  APPOINTMENT_BOOKING_FORM_FIELDS,
  APPOINTMENT_NOTES_MAX_LENGTH,
  APPOINTMENT_REASON_MAX_LENGTH,
} from "@/constants/appointments";
import { APPOINTMENT_BOOKING_DIALOG_TEXT } from "@/components/dialogs/AppointmentBookingDialog.text";
import type { ApiFieldErrors } from "@/types/api";
import type { PatientDoctor } from "@/types/patientDoctor";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { formatDateTimeRange } from "@/utils/doctorAvailability/dateTime";
import { applyApiFieldErrors } from "@/utils/forms/applyApiFieldErrors";
import {
  appointmentBookingFormSchema,
  EMPTY_APPOINTMENT_BOOKING_FORM_VALUES,
  type AppointmentBookingFormValues,
} from "@/utils/validation/appointmentBookingValidation";

interface AppointmentBookingDialogProps {
  open: boolean;
  doctor: PatientDoctor | null;
  availability: DoctorAvailability | null;
  fieldErrors: ApiFieldErrors;
  onClose: () => void;
  onSubmit: (
    values: AppointmentBookingFormValues,
  ) => boolean | Promise<boolean>;
}

export function AppointmentBookingDialog({
  open,
  doctor,
  availability,
  fieldErrors,
  onClose,
  onSubmit,
}: AppointmentBookingDialogProps) {
  const form = useForm<AppointmentBookingFormValues>({
    resolver: zodResolver(appointmentBookingFormSchema),
    defaultValues: EMPTY_APPOINTMENT_BOOKING_FORM_VALUES,
  });
  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    if (open) {
      form.reset(EMPTY_APPOINTMENT_BOOKING_FORM_VALUES);
    }
  }, [form, open]);

  useEffect(() => {
    applyApiFieldErrors<AppointmentBookingFormValues>(
      fieldErrors,
      form.setError,
      APPOINTMENT_BOOKING_FORM_FIELDS,
    );
  }, [fieldErrors, form.setError]);

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors();
    await onSubmit(values);
  });

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <Stack component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>{APPOINTMENT_BOOKING_DIALOG_TEXT.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {APPOINTMENT_BOOKING_DIALOG_TEXT.doctorLabel}
              </Typography>
              <Typography>{doctor?.fullName}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {APPOINTMENT_BOOKING_DIALOG_TEXT.departmentLabel}
              </Typography>
              <Typography>{doctor?.departmentName}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {APPOINTMENT_BOOKING_DIALOG_TEXT.slotLabel}
              </Typography>
              <Typography>
                {availability
                  ? formatDateTimeRange(availability.startTime, availability.endTime)
                  : ""}
              </Typography>
            </Stack>
            <TextField
              label={APPOINTMENT_BOOKING_DIALOG_TEXT.reasonLabel}
              disabled={isSubmitting}
              error={Boolean(errors.reason)}
              helperText={
                errors.reason?.message ??
                APPOINTMENT_BOOKING_DIALOG_TEXT.optionalField
              }
              slotProps={{
                htmlInput: { maxLength: APPOINTMENT_REASON_MAX_LENGTH },
              }}
              {...form.register("reason")}
            />
            <TextField
              label={APPOINTMENT_BOOKING_DIALOG_TEXT.notesLabel}
              multiline
              minRows={3}
              disabled={isSubmitting}
              error={Boolean(errors.notes)}
              helperText={
                errors.notes?.message ??
                APPOINTMENT_BOOKING_DIALOG_TEXT.optionalField
              }
              slotProps={{
                htmlInput: { maxLength: APPOINTMENT_NOTES_MAX_LENGTH },
              }}
              {...form.register("notes")}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text" disabled={isSubmitting} onClick={onClose}>
            {APPOINTMENT_BOOKING_DIALOG_TEXT.cancel}
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!doctor || !availability}
          >
            {APPOINTMENT_BOOKING_DIALOG_TEXT.confirm}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
