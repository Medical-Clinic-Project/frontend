"use client";

import { useState, type RefObject } from "react";
import { deleteDoctorAvailability } from "@/api/doctorAvailabilityApi";
import { useToast } from "@/hooks/useToast";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { getUserFacingError } from "@/utils/apiErrors";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityText";

interface UseDoctorAvailabilityDeleteOptions {
  isMounted: RefObject<boolean>;
  removeAvailability: (availabilityId: number) => void;
}

export function useDoctorAvailabilityDelete({
  isMounted,
  removeAvailability,
}: UseDoctorAvailabilityDeleteOptions) {
  const { showToast } = useToast();
  const [deleteAvailability, setDeleteAvailability] =
    useState<DoctorAvailability | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = (availability: DoctorAvailability) => {
    setDeleteAvailability(availability);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteOpen(false);
    setDeleteAvailability(null);
  };

  const confirmDelete = async (): Promise<boolean> => {
    if (!deleteAvailability || isDeleting) {
      return false;
    }

    setIsDeleting(true);

    try {
      await deleteDoctorAvailability(deleteAvailability.id);

      if (!isMounted.current) {
        return false;
      }

      removeAvailability(deleteAvailability.id);
      showToast(DOCTOR_AVAILABILITY_TEXT.feedback.deleted);
      setIsDeleteOpen(false);
      setDeleteAvailability(null);
      return true;
    } catch (error) {
      if (isMounted.current) {
        showToast(
          getUserFacingError(error, DOCTOR_AVAILABILITY_TEXT.errors.delete),
          "error",
        );
      }
      return false;
    } finally {
      if (isMounted.current) {
        setIsDeleting(false);
      }
    }
  };

  return {
    closeDeleteDialog,
    confirmDelete,
    deleteAvailability,
    isDeleteOpen,
    isDeleting,
    requestDelete,
  };
}
