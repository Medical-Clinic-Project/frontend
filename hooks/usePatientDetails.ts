"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPatientById } from "@/api/patientsApi";
import type { Patient } from "@/types/patient";
import { getUserFacingError } from "@/utils/apiErrors";
import { PATIENTS_TEXT } from "@/views/patients/PatientsText";

export function usePatientDetails() {
  const [detailsPatient, setDetailsPatient] = useState<Patient | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const detailsLoadController = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      detailsLoadController.current?.abort();
    };
  }, []);

  const loadPatientDetails = useCallback(
    async (patientId: number, signal: AbortSignal): Promise<void> => {
      setIsDetailsLoading(true);
      setDetailsError(null);

      try {
        const patient = await getPatientById(patientId, signal);

        if (!signal.aborted) {
          setDetailsPatient(patient);
        }
      } catch (error) {
        if (!signal.aborted) {
          setDetailsError(getUserFacingError(error, PATIENTS_TEXT.errors.details));
        }
      } finally {
        if (!signal.aborted) {
          setIsDetailsLoading(false);
        }
      }
    },
    [],
  );

  const startDetailsLoad = useCallback(
    (patientId: number) => {
      detailsLoadController.current?.abort();
      const abortController = new AbortController();
      detailsLoadController.current = abortController;

      void loadPatientDetails(patientId, abortController.signal).finally(() => {
        if (detailsLoadController.current === abortController) {
          detailsLoadController.current = null;
        }
      });
    },
    [loadPatientDetails],
  );

  const openDetailsDialog = useCallback(
    (patient: Patient) => {
      setDetailsPatient(patient);
      setDetailsError(null);
      setIsDetailsDialogOpen(true);
      startDetailsLoad(patient.id);
    },
    [startDetailsLoad],
  );

  const closeDetailsDialog = useCallback(() => {
    detailsLoadController.current?.abort();
    detailsLoadController.current = null;
    setIsDetailsDialogOpen(false);
    setIsDetailsLoading(false);
    setDetailsError(null);
    setDetailsPatient(null);
  }, []);

  const retryLoadPatientDetails = useCallback(() => {
    if (detailsPatient) {
      startDetailsLoad(detailsPatient.id);
    }
  }, [detailsPatient, startDetailsLoad]);

  return {
    detailsPatient,
    isDetailsDialogOpen,
    isDetailsLoading,
    detailsError,
    openDetailsDialog,
    closeDetailsDialog,
    retryLoadPatientDetails,
  };
}
