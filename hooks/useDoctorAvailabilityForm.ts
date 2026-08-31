"use client";

import { useState, type RefObject } from "react";
import {
  createDoctorAvailability,
  updateDoctorAvailability,
} from "@/api/doctorAvailabilityApi";
import { DOCTOR_AVAILABILITY_FORM_FIELDS } from "@/constants/doctorAvailability";
import { useToast } from "@/hooks/useToast";
import type { ApiFieldErrors } from "@/types/api";
import { ApiError } from "@/types/api";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { getUserFacingError } from "@/utils/apiErrors";
import { getDoctorAvailabilityRequest } from "@/utils/doctorAvailability/availability";
import { startOfLocalDay } from "@/utils/doctorAvailability/dateTime";
import type { DoctorAvailabilityFormValues } from "@/utils/validation/doctorAvailabilityValidation";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityText";

interface UseDoctorAvailabilityFormOptions {
  isMounted: RefObject<boolean>;
  mergeAvailability: (availability: DoctorAvailability) => void;
  refreshAvailability: (showLoading?: boolean) => void;
  setSelectedDate: (date: Date) => void;
}

export function useDoctorAvailabilityForm({
  isMounted,
  mergeAvailability,
  refreshAvailability,
  setSelectedDate,
}: UseDoctorAvailabilityFormOptions) {
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] =
    useState<DoctorAvailability | null>(null);
  const [formFieldErrors, setFormFieldErrors] =
    useState<ApiFieldErrors>({});

  const openCreateDialog = () => {
    setFormFieldErrors({});
    setSelectedAvailability(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (slot: DoctorAvailability) => {
    setFormFieldErrors({});
    setSelectedAvailability(slot);
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setFormFieldErrors({});
    setSelectedAvailability(null);
  };

  const hideFormDialog = () => {
    setIsFormOpen(false);
  };

  const clearSelectedAvailability = () => {
    setSelectedAvailability(null);
  };

  const handleSaveError = (error: unknown): false => {
    if (
      error instanceof ApiError &&
      error.status === 400 &&
      Object.keys(error.fieldErrors).length > 0
    ) {
      const supportedErrors = Object.fromEntries(
        Object.entries(error.fieldErrors).filter(([field]) =>
          DOCTOR_AVAILABILITY_FORM_FIELDS.includes(
            field as (typeof DOCTOR_AVAILABILITY_FORM_FIELDS)[number],
          ),
        ),
      );

      if (Object.keys(supportedErrors).length > 0) {
        setFormFieldErrors(supportedErrors);
        showToast(error.message, "error");
        return false;
      }
    }

    showToast(
      getUserFacingError(error, DOCTOR_AVAILABILITY_TEXT.errors.save),
      "error",
    );
    return false;
  };

  const saveAvailability = async (
    values: DoctorAvailabilityFormValues,
  ): Promise<boolean> => {
    setFormFieldErrors({});
    const request = getDoctorAvailabilityRequest(values);

    if (!request) {
      showToast(DOCTOR_AVAILABILITY_TEXT.errors.save, "error");
      return false;
    }

    try {
      const savedAvailability = selectedAvailability
        ? await updateDoctorAvailability(selectedAvailability.id, request)
        : await createDoctorAvailability(request);

      if (!isMounted.current) {
        return true;
      }

      mergeAvailability(savedAvailability);
      setSelectedDate(
        startOfLocalDay(new Date(savedAvailability.startTime)),
      );
      showToast(
        selectedAvailability
          ? DOCTOR_AVAILABILITY_TEXT.feedback.updated
          : DOCTOR_AVAILABILITY_TEXT.feedback.created,
      );
      closeFormDialog();
      refreshAvailability(false);
      return true;
    } catch (error) {
      return isMounted.current ? handleSaveError(error) : false;
    }
  };

  return {
    clearSelectedAvailability,
    closeFormDialog,
    formFieldErrors,
    hideFormDialog,
    isFormOpen,
    openCreateDialog,
    openEditDialog,
    saveAvailability,
    selectedAvailability,
  };
}
