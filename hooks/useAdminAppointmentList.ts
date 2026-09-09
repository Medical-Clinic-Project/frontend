"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAllAppointments } from "@/api/appointmentsApi";
import { ADMIN_APPOINTMENT_SEARCH_DEBOUNCE_MS } from "@/constants/appointments";
import type { Appointment, AppointmentQuery } from "@/types/appointment";
import { getUserFacingError } from "@/utils/apiErrors";
import { sortAppointmentsByStartTime } from "@/utils/appointments";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

export function useAdminAppointmentList(query: AppointmentQuery) {
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
        const loadedAppointments = await getAllAppointments(query, controller.signal);

        if (!controller.signal.aborted) {
          setAppointments(sortAppointmentsByStartTime(loadedAppointments));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(getUserFacingError(error, ADMIN_APPOINTMENTS_TEXT.errors.load));
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
    [query],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => void refreshAppointments(),
      query.search ? ADMIN_APPOINTMENT_SEARCH_DEBOUNCE_MS : 0,
    );

    return () => {
      window.clearTimeout(timeoutId);
      loadController.current?.abort();
      loadController.current = null;
    };
  }, [query.search, refreshAppointments]);

  return {
    appointments,
    isLoading,
    loadError,
    refreshAppointments,
  };
}
