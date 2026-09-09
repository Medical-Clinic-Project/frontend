"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { PATIENT_PROFILE_FIELDS } from "@/constants/patients";
import type { ApiFieldErrors } from "@/types/api";
import type { Patient } from "@/types/patient";
import { applyApiFieldErrors } from "@/utils/forms/applyApiFieldErrors";
import { getPatientProfileFormValues } from "@/utils/forms/patientProfileFormValues";
import {
  patientProfileFormSchema,
  type PatientProfileFormValues,
} from "@/utils/validation/patientProfileValidation";
import { PATIENT_PROFILE_TEXT } from "@/views/patientProfile/PatientProfileText";

interface PatientProfileFormProps {
  patient: Patient;
  fieldErrors: ApiFieldErrors;
  onSubmit: (values: PatientProfileFormValues) => Promise<boolean>;
}

export function PatientProfileForm({
  patient,
  fieldErrors,
  onSubmit,
}: PatientProfileFormProps) {
  const form = useForm<PatientProfileFormValues>({
    resolver: zodResolver(patientProfileFormSchema),
    defaultValues: getPatientProfileFormValues(patient),
  });
  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    form.reset(getPatientProfileFormValues(patient));
  }, [form, patient]);

  useEffect(() => {
    applyApiFieldErrors<PatientProfileFormValues>(
      fieldErrors,
      form.setError,
      PATIENT_PROFILE_FIELDS,
    );
  }, [fieldErrors, form.setError]);

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors();
    await onSubmit(values);
  });

  const statusLabel = patient.isActive
    ? PATIENT_PROFILE_TEXT.status.active
    : PATIENT_PROFILE_TEXT.status.inactive;

  return (
    <Paper variant="outlined">
      <Stack
        component="form"
        spacing={3}
        noValidate
        onSubmit={handleSubmit}
        sx={{ p: { xs: 3, sm: 4 } }}
      >
        <Stack spacing={1}>
          <Typography component="h2" variant="h4">
            {PATIENT_PROFILE_TEXT.form.title}
          </Typography>
          <Typography color="text.secondary">
            {PATIENT_PROFILE_TEXT.form.description}
          </Typography>
        </Stack>

        <TextField
          label={PATIENT_PROFILE_TEXT.form.fullNameLabel}
          autoComplete="name"
          autoFocus
          disabled={isSubmitting}
          error={Boolean(errors.fullName)}
          helperText={errors.fullName?.message}
          {...form.register("fullName")}
        />

        <TextField
          label={PATIENT_PROFILE_TEXT.form.emailLabel}
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...form.register("email")}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          useFlexGap
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Typography color="text.secondary">
            {PATIENT_PROFILE_TEXT.form.statusLabel}
          </Typography>
          <Chip
            label={statusLabel}
            color={patient.isActive ? "success" : "default"}
            variant={patient.isActive ? "filled" : "outlined"}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "flex-end" }}
        >
          <Button type="submit" loading={isSubmitting}>
            {PATIENT_PROFILE_TEXT.form.save}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
