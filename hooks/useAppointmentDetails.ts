"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAppointmentById } from "@/api/appointmentsApi";
import type { Appointment } from "@/types/appointment";
import { getUserFacingError } from "@/utils/apiErrors";

interface UseAppointmentDetailsOptions {
  loadErrorMessage: string;
}

export function useAppointmentDetails({
  loadErrorMessage,
}: UseAppointmentDetailsOptions) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadController = useRef<AbortController | null>(null);

  const loadAppointment = useCallback(
    async (id: number): Promise<void> => {
      loadController.current?.abort();
      const controller = new AbortController();
      loadController.current = controller;
      setIsLoading(true);
      setError(null);

      try {
        const loadedAppointment = await getAppointmentById(id, controller.signal);

        if (!controller.signal.aborted) {
          setAppointment(loadedAppointment);
        }
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(getUserFacingError(loadError, loadErrorMessage));
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
    [loadErrorMessage],
  );

  useEffect(
    () => () => {
      loadController.current?.abort();
      loadController.current = null;
    },
    [],
  );

  const openDetailsDialog = (selectedAppointment: Appointment) => {
    setAppointmentId(selectedAppointment.id);
    setAppointment(null);
    void loadAppointment(selectedAppointment.id);
  };

  const closeDetailsDialog = () => {
    loadController.current?.abort();
    loadController.current = null;
    setAppointmentId(null);
    setAppointment(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    closeDetailsDialog,
    detailsAppointment: appointment,
    detailsError: error,
    isDetailsDialogOpen: appointmentId !== null,
    isDetailsLoading: isLoading,
    openDetailsDialog,
    retryLoadAppointmentDetails: () => {
      if (appointmentId !== null) {
        void loadAppointment(appointmentId);
      }
    },
  };
}
