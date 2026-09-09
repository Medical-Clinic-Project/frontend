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
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import { PasswordField } from "@/components/auth/PasswordField";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import {
  CREATE_DOCTOR_FORM_FIELDS,
  EMPTY_CREATE_DOCTOR_FORM_VALUES,
  UPDATE_DOCTOR_FORM_FIELDS,
} from "@/constants/doctors";
import type { ApiFieldErrors } from "@/types/api";
import type { Department } from "@/types/department";
import type { Doctor } from "@/types/doctor";
import { applyApiFieldErrors } from "@/utils/forms/applyApiFieldErrors";
import { getDoctorUpdateFormValues } from "@/utils/forms/doctorFormValues";
import {
  doctorFormSchema,
  type CreateDoctorFormValues,
  type DoctorFormValues,
} from "@/utils/validation/doctorValidation";
import { DOCTORS_TEXT } from "@/views/doctors/DoctorsText";

interface DoctorFormDialogProps {
  open: boolean;
  doctor: Doctor | null;
  departments: readonly Department[];
  departmentsLoading: boolean;
  departmentsError: string | null;
  fieldErrors: ApiFieldErrors;
  onClose: () => void;
  onRetryDepartments: () => void | Promise<void>;
  onSubmit: (values: DoctorFormValues) => boolean | Promise<boolean>;
}

interface DepartmentOption {
  id: number;
  name: string;
  isActive: boolean;
}

export function DoctorFormDialog({
  open,
  doctor,
  departments,
  departmentsLoading,
  departmentsError,
  fieldErrors,
  onClose,
  onRetryDepartments,
  onSubmit,
}: DoctorFormDialogProps) {
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: doctor
      ? getDoctorUpdateFormValues(doctor)
      : EMPTY_CREATE_DOCTOR_FORM_VALUES,
  });
  const { errors, isSubmitting } = form.formState;
  const isEditMode = Boolean(doctor);
  const createErrors = isEditMode
    ? undefined
    : (errors as FieldErrors<CreateDoctorFormValues>);
  const activeDepartments = departments.filter((department) => department.isActive);
  const departmentOptions: DepartmentOption[] = activeDepartments.map(
    ({ id, name }) => ({ id, name, isActive: true }),
  );
  const fetchedCurrentDepartment = doctor
    ? departments.find((department) => department.id === doctor.departmentId)
    : undefined;
  const needsCurrentDepartmentFallback = Boolean(
    doctor &&
      (!fetchedCurrentDepartment || !fetchedCurrentDepartment.isActive),
  );

  if (doctor && needsCurrentDepartmentFallback) {
    departmentOptions.push({
      id: doctor.department.id,
      name: doctor.department.name,
      isActive: false,
    });
  }

  const selectedDepartmentId = useWatch({
    control: form.control,
    name: "departmentId",
  });
  const password = useWatch({
    control: form.control,
    name: "password",
  });
  const selectionIsUnassignable =
    selectedDepartmentId > 0 &&
    !activeDepartments.some(
      (department) => department.id === selectedDepartmentId,
    );
  const departmentsUnavailable =
    departmentsLoading ||
    Boolean(departmentsError) ||
    activeDepartments.length === 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(
      doctor ? getDoctorUpdateFormValues(doctor) : EMPTY_CREATE_DOCTOR_FORM_VALUES,
    );
  }, [doctor, form, open]);

  useEffect(() => {
    applyApiFieldErrors<DoctorFormValues>(
      fieldErrors,
      form.setError,
      isEditMode ? UPDATE_DOCTOR_FORM_FIELDS : CREATE_DOCTOR_FORM_FIELDS,
    );
  }, [fieldErrors, form.setError, isEditMode]);

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors();
    const wasSaved = await onSubmit(values);

    if (wasSaved && values.mode === "create") {
      form.reset(EMPTY_CREATE_DOCTOR_FORM_VALUES);
    }
  });

  const handleClose = () => {
    if (!isEditMode) {
      form.reset(EMPTY_CREATE_DOCTOR_FORM_VALUES);
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : handleClose}
      fullWidth
      maxWidth="sm"
    >
      <Stack component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>
          {isEditMode
            ? DOCTORS_TEXT.dialog.editTitle
            : DOCTORS_TEXT.dialog.createTitle}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              label={DOCTORS_TEXT.dialog.fullNameLabel}
              autoFocus
              autoComplete="name"
              disabled={isSubmitting}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
              {...form.register("fullName")}
            />

            <TextField
              label={DOCTORS_TEXT.dialog.emailLabel}
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...form.register("email")}
            />

            {!isEditMode && (
              <>
                <Stack spacing={1}>
                  <PasswordField
                    label={DOCTORS_TEXT.dialog.passwordLabel}
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    error={Boolean(createErrors?.password)}
                    helperText={createErrors?.password?.message}
                    {...form.register("password")}
                  />
                  <PasswordRequirements password={password ?? ""} />
                </Stack>

                <PasswordField
                  label={DOCTORS_TEXT.dialog.confirmPasswordLabel}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  error={Boolean(createErrors?.confirmPassword)}
                  helperText={createErrors?.confirmPassword?.message}
                  {...form.register("confirmPassword")}
                />
              </>
            )}

            {departmentsLoading ? (
              <Alert severity="info">{DOCTORS_TEXT.departmentStates.loading}</Alert>
            ) : departmentsError ? (
              <Alert
                severity="error"
                action={
                  <Button
                    type="button"
                    color="inherit"
                    size="small"
                    onClick={() => void onRetryDepartments()}
                  >
                    {DOCTORS_TEXT.retry}
                  </Button>
                }
              >
                {departmentsError}
              </Alert>
            ) : activeDepartments.length === 0 ? (
              <Alert severity="warning">
                {DOCTORS_TEXT.departmentStates.noActive}
              </Alert>
            ) : null}

            <Controller
              name="departmentId"
              control={form.control}
              render={({ field }) => (
                <TextField
                  select
                  label={DOCTORS_TEXT.dialog.departmentLabel}
                  value={field.value || ""}
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                  inputRef={field.ref}
                  disabled={departmentsUnavailable || isSubmitting}
                  error={Boolean(errors.departmentId)}
                  helperText={
                    errors.departmentId?.message ??
                    (selectionIsUnassignable
                      ? DOCTORS_TEXT.departmentStates.reassignmentRequired
                      : DOCTORS_TEXT.dialog.departmentHelper)
                  }
                >
                  <MenuItem value="" disabled>
                    {DOCTORS_TEXT.dialog.departmentPlaceholder}
                  </MenuItem>
                  {departmentOptions.map((department) => (
                    <MenuItem
                      key={department.id}
                      value={department.id}
                      disabled={!department.isActive}
                    >
                      {department.name}
                      {!department.isActive
                        ? ` ${DOCTORS_TEXT.departmentStates.inactiveSuffix}`
                        : ""}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            flexDirection: { xs: "column-reverse", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Button
            type="button"
            variant="text"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            {DOCTORS_TEXT.dialog.cancel}
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={
              isSubmitting || departmentsUnavailable || selectionIsUnassignable
            }
          >
            {isEditMode
              ? DOCTORS_TEXT.dialog.save
              : DOCTORS_TEXT.dialog.create}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
