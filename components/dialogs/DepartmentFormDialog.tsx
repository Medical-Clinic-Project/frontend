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
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import type { ApiFieldErrors } from "@/types/api";
import type { Department } from "@/types/department";
import { applyApiFieldErrors } from "@/utils/forms/applyApiFieldErrors";
import { DEPARTMENTS_TEXT } from "@/views/departments/Departments.text";
import {
  departmentFormSchema,
  type DepartmentFormValues,
} from "@/utils/validation/departmentValidation";

const DEPARTMENT_FIELDS = ["name", "description", "isActive"] as const;

interface DepartmentFormDialogProps {
  open: boolean;
  department: Department | null;
  fieldErrors: ApiFieldErrors;
  submissionError: string | null;
  onClose: () => void;
  onSubmit: (values: DepartmentFormValues) => boolean | Promise<boolean>;
}

const EMPTY_VALUES: DepartmentFormValues = {
  name: "",
  description: "",
  isActive: true,
};

export function DepartmentFormDialog({
  open,
  department,
  fieldErrors,
  submissionError,
  onClose,
  onSubmit,
}: DepartmentFormDialogProps) {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: EMPTY_VALUES,
  });
  const { errors, isSubmitting } = form.formState;
  const isEditMode = Boolean(department);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(
      department
        ? {
            name: department.name,
            description: department.description,
            isActive: department.isActive,
          }
        : EMPTY_VALUES,
    );
  }, [department, form, open]);

  useEffect(() => {
    applyApiFieldErrors<DepartmentFormValues>(
      fieldErrors,
      form.setError,
      DEPARTMENT_FIELDS,
    );
  }, [fieldErrors, form.setError]);

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors();
    await onSubmit(values);
  });

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="sm">
      <Stack component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>
          {isEditMode
            ? DEPARTMENTS_TEXT.dialog.editTitle
            : DEPARTMENTS_TEXT.dialog.createTitle}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {submissionError && <Alert severity="error">{submissionError}</Alert>}

            <TextField
              label={DEPARTMENTS_TEXT.dialog.nameLabel}
              autoFocus
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...form.register("name")}
            />

            <TextField
              label={DEPARTMENTS_TEXT.dialog.descriptionLabel}
              multiline
              minRows={3}
              error={Boolean(errors.description)}
              helperText={
                errors.description?.message ?? DEPARTMENTS_TEXT.dialog.descriptionHelper
              }
              {...form.register("description")}
            />

            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(_, checked) => field.onChange(checked)}
                    />
                  }
                  label={DEPARTMENTS_TEXT.dialog.activeLabel}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text" disabled={isSubmitting} onClick={onClose}>
            {DEPARTMENTS_TEXT.dialog.cancel}
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditMode
              ? DEPARTMENTS_TEXT.dialog.save
              : DEPARTMENTS_TEXT.dialog.create}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
