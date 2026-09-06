"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { updatePatient } from "@/api/patientsApi";
import { useToast } from "@/hooks/useToast";
import type { Patient } from "@/types/patient";
import { getUserFacingError } from "@/utils/apiErrors";
import { PATIENTS_TEXT } from "@/views/patients/PatientsText";

interface UsePatientStatusOptions {
  onStatusUpdated: () => Promise<void>;
}

export function usePatientStatus({ onStatusUpdated }: UsePatientStatusOptions) {
  const { showToast } = useToast();
  const [statusPatient, setStatusPatient] = useState<Patient | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const openStatusDialog = useCallback((patient: Patient) => {
    setStatusPatient(patient);
  }, []);

  const closeStatusDialog = useCallback(() => {
    if (statusUpdatingId !== null) {
      return;
    }

    setStatusPatient(null);
  }, [statusUpdatingId]);

  const confirmStatusChange = useCallback(async (): Promise<void> => {
    if (!statusPatient || statusUpdatingId !== null) {
      return;
    }

    const patientToUpdate = statusPatient;
    setStatusUpdatingId(patientToUpdate.id);

    try {
      const updatedPatient = await updatePatient(patientToUpdate.id, {
        isActive: !patientToUpdate.isActive,
      });

      if (!isMounted.current) {
        return;
      }

      await onStatusUpdated();

      if (!isMounted.current) {
        return;
      }

      showToast(
        updatedPatient.isActive
          ? PATIENTS_TEXT.feedback.activated(updatedPatient.fullName)
          : PATIENTS_TEXT.feedback.deactivated(updatedPatient.fullName),
      );
      setStatusPatient(null);
    } catch (error) {
      if (isMounted.current) {
        showToast(getUserFacingError(error, PATIENTS_TEXT.errors.status), "error");
      }
    } finally {
      if (isMounted.current) {
        setStatusUpdatingId(null);
      }
    }
  }, [onStatusUpdated, showToast, statusPatient, statusUpdatingId]);

  return {
    statusPatient,
    isStatusDialogOpen: statusPatient !== null,
    isStatusUpdating: statusUpdatingId !== null,
    statusUpdatingId,
    openStatusDialog,
    closeStatusDialog,
    confirmStatusChange,
  };
}
