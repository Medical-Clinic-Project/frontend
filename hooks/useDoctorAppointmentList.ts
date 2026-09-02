"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCancelledAppointments,
  getCompletedAppointments,
  getTodayAppointments,
  getUpcomingAppointments,
} from "@/api/appointmentsApi";
import { DOCTOR_APPOINTMENT_TABS } from "@/constants/appointments";
import type { Appointment } from "@/types/appointment";
import { getUserFacingError } from "@/utils/apiErrors";
import {
  sortAppointmentsByStartTime,
  type DoctorAppointmentTab,
} from "@/utils/appointments";
import { DOCTOR_APPOINTMENTS_TEXT } from "@/views/doctorAppointments/DoctorAppointmentsText";

type AppointmentLoader = (signal?: AbortSignal) => Promise<Appointment[]>;

const appointmentLoaders: Record<DoctorAppointmentTab, AppointmentLoader> = {
  [DOCTOR_APPOINTMENT_TABS.TODAY]: getTodayAppointments,
  [DOCTOR_APPOINTMENT_TABS.UPCOMING]: getUpcomingAppointments,
  [DOCTOR_APPOINTMENT_TABS.COMPLETED]: getCompletedAppointments,
  [DOCTOR_APPOINTMENT_TABS.CANCELLED]: getCancelledAppointments,
};

export function useDoctorAppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<DoctorAppointmentTab>(
    DOCTOR_APPOINTMENT_TABS.TODAY,
  );
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
        const loadedAppointments = await appointmentLoaders[tab](controller.signal);

        if (!controller.signal.aborted) {
          setAppointments(sortAppointmentsByStartTime(loadedAppointments));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(getUserFacingError(error, DOCTOR_APPOINTMENTS_TEXT.errors.load));
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
    [tab],
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
    setTab,
    tab,
  };
}
