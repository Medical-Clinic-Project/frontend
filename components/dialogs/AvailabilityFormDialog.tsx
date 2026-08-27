"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import type { ApiFieldErrors } from "@/types/api";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { applyApiFieldErrors } from "@/utils/forms/applyApiFieldErrors";
import {
  doctorAvailabilityFormSchema,
  type DoctorAvailabilityFormValues,
} from "@/utils/validation/doctorAvailabilityValidation";
import {
  addMinutes,
  startOfLocalDay,
  toLocalDateTimeInput,
} from "@/views/doctorAvailability/doctorAvailabilityDates";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityView.text";

const FORM_FIELDS = ["startTime", "endTime"] as const;
const DEFAULT_START_HOUR = 9;
const DEFAULT_DURATION_MINUTES = 60;
const DEFAULT_ROUNDING_MINUTES = 30;

interface AvailabilityFormDialogProps {
  open: boolean;
  availability: DoctorAvailability | null;
  selectedDate: Date;
  fieldErrors: ApiFieldErrors;
  submissionError: string | null;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (
    values: DoctorAvailabilityFormValues,
  ) => boolean | Promise<boolean>;
}

function roundUp(value: Date, minutes: number): Date {
  const result = new Date(value);
  result.setSeconds(0, 0);
  const remainder = result.getMinutes() % minutes;

  if (remainder || result.getTime() <= value.getTime()) {
    result.setMinutes(result.getMinutes() + (minutes - remainder));
  }

  return result;
}

function getCreateValues(selectedDate: Date): DoctorAvailabilityFormValues {
  const selectedStart = startOfLocalDay(selectedDate);
  selectedStart.setHours(DEFAULT_START_HOUR);
  const now = new Date();
  const start = selectedStart > now
    ? selectedStart
    : roundUp(now, DEFAULT_ROUNDING_MINUTES);

  return {
    startTime: toLocalDateTimeInput(start),
    endTime: toLocalDateTimeInput(
      addMinutes(start, DEFAULT_DURATION_MINUTES),
    ),
  };
}

function getEditValues(
  availability: DoctorAvailability,
): DoctorAvailabilityFormValues {
  return {
    startTime: toLocalDateTimeInput(new Date(availability.startTime)),
    endTime: toLocalDateTimeInput(new Date(availability.endTime)),
  };
}

export function AvailabilityFormDialog({
  open,
  availability,
  selectedDate,
  fieldErrors,
  submissionError,
  onClose,
  onDelete,
  onSubmit,
}: AvailabilityFormDialogProps) {
  const form = useForm<DoctorAvailabilityFormValues>({
    resolver: zodResolver(doctorAvailabilityFormSchema),
    defaultValues: getCreateValues(selectedDate),
  });
  const { errors, isSubmitting } = form.formState;
  const isEditMode = Boolean(availability);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(
      availability
        ? getEditValues(availability)
        : getCreateValues(selectedDate),
    );
  }, [availability, form, open, selectedDate]);

  useEffect(() => {
    applyApiFieldErrors<DoctorAvailabilityFormValues>(
      fieldErrors,
      form.setError,
      FORM_FIELDS,
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
        <DialogTitle>
          {isEditMode
            ? DOCTOR_AVAILABILITY_TEXT.form.editTitle
            : DOCTOR_AVAILABILITY_TEXT.form.createTitle}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {submissionError && (
              <Alert severity="error">{submissionError}</Alert>
            )}

            <TextField
              label={DOCTOR_AVAILABILITY_TEXT.form.startTimeLabel}
              type="datetime-local"
              autoFocus
              disabled={isSubmitting}
              error={Boolean(errors.startTime)}
              helperText={errors.startTime?.message}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { step: 300 },
              }}
              {...form.register("startTime")}
            />

            <TextField
              label={DOCTOR_AVAILABILITY_TEXT.form.endTimeLabel}
              type="datetime-local"
              disabled={isSubmitting}
              error={Boolean(errors.endTime)}
              helperText={errors.endTime?.message}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { step: 300 },
              }}
              {...form.register("endTime")}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            sx={{
              width: "100%",
              gap: 1.5,
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: isEditMode ? "space-between" : "flex-end",
            }}
          >
            {isEditMode && (
              <Button
                color="error"
                variant="outlined"
                disabled={isSubmitting}
                onClick={onDelete}
              >
                {DOCTOR_AVAILABILITY_TEXT.deleteDialog.confirm}
              </Button>
            )}
            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              sx={{ gap: 1.5 }}
            >
              <Button
                variant="text"
                disabled={isSubmitting}
                onClick={onClose}
              >
                {DOCTOR_AVAILABILITY_TEXT.form.cancel}
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {isEditMode
                  ? DOCTOR_AVAILABILITY_TEXT.form.save
                  : DOCTOR_AVAILABILITY_TEXT.form.create}
              </Button>
            </Stack>
          </Stack>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
