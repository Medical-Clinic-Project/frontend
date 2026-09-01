"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMyAppointments } from "@/api/appointmentsApi";
import type { Appointment } from "@/types/appointment";
import { getUserFacingError } from "@/utils/apiErrors";
import { sortAppointmentsByStartTime } from "@/utils/appointments";
import { PATIENT_APPOINTMENTS_TEXT } from "@/views/patientAppointments/PatientAppointments.text";

export function usePatientAppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadController = useRef<AbortController | null>(null);

  const refreshAppointments = useCallback(
    async (showLoading = true): Promise<void> => {
      loadController.current?.abort();
      const controller = new AbortController();
      loadController.current = controller;

      if (showLoading) {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        const loadedAppointments = await getMyAppointments(controller.signal);

        if (!controller.signal.aborted) {
          setAppointments(sortAppointmentsByStartTime(loadedAppointments));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(getUserFacingError(error, PATIENT_APPOINTMENTS_TEXT.errors.load));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }

        if (loadController.current === controller) {
          loadController.current = null;
        }
      }
    },
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshAppointments();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      loadController.current?.abort();
      loadController.current = null;
    };
  }, [refreshAppointments]);

  return {
    appointments,
    isLoading,
    loadError,
    refreshAppointments,
  };
}
