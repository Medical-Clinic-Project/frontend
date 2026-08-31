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
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  DOCTOR_AVAILABILITY_DATE_TIME_INPUT_STEP_SECONDS,
  DOCTOR_AVAILABILITY_FORM_FIELDS,
} from "@/constants/doctorAvailability";
import type { ApiFieldErrors } from "@/types/api";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { applyApiFieldErrors } from "@/utils/forms/applyApiFieldErrors";
import {
  getCreateDoctorAvailabilityFormValues,
  getDoctorAvailabilityEditFormValues,
} from "@/utils/forms/doctorAvailabilityFormValues";
import {
  doctorAvailabilityFormSchema,
  type DoctorAvailabilityFormValues,
} from "@/utils/validation/doctorAvailabilityValidation";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityText";

interface AvailabilityFormDialogProps {
  open: boolean;
  availability: DoctorAvailability | null;
  selectedDate: Date;
  fieldErrors: ApiFieldErrors;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (
    values: DoctorAvailabilityFormValues,
  ) => boolean | Promise<boolean>;
}

export function AvailabilityFormDialog({
  open,
  availability,
  selectedDate,
  fieldErrors,
  onClose,
  onDelete,
  onSubmit,
}: AvailabilityFormDialogProps) {
  const form = useForm<DoctorAvailabilityFormValues>({
    resolver: zodResolver(doctorAvailabilityFormSchema),
    defaultValues: getCreateDoctorAvailabilityFormValues(selectedDate),
  });
  const { errors, isSubmitting } = form.formState;
  const isEditMode = Boolean(availability);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(
      availability
        ? getDoctorAvailabilityEditFormValues(availability)
        : getCreateDoctorAvailabilityFormValues(selectedDate),
    );
  }, [availability, form, open, selectedDate]);

  useEffect(() => {
    applyApiFieldErrors<DoctorAvailabilityFormValues>(
      fieldErrors,
      form.setError,
      DOCTOR_AVAILABILITY_FORM_FIELDS,
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
            <TextField
              label={DOCTOR_AVAILABILITY_TEXT.form.startTimeLabel}
              type="datetime-local"
              autoFocus
              disabled={isSubmitting}
              error={Boolean(errors.startTime)}
              helperText={errors.startTime?.message}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  step: DOCTOR_AVAILABILITY_DATE_TIME_INPUT_STEP_SECONDS,
                },
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
                htmlInput: {
                  step: DOCTOR_AVAILABILITY_DATE_TIME_INPUT_STEP_SECONDS,
                },
              }}
              {...form.register("endTime")}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={1.5}
            useFlexGap
            sx={{
              width: "100%",
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
              spacing={1.5}
              useFlexGap
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
