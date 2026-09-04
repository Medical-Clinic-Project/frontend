"use client";

import { useMemo } from "react";
import { usePatientAppointmentList } from "@/hooks/usePatientAppointmentList";
import { canManagePatientAppointment } from "@/utils/appointments";
import { PATIENT_HOME_TEXT } from "@/views/patientHome/PatientHomeText";

export function usePatientHome() {
  const appointmentList = usePatientAppointmentList({
    loadErrorMessage: PATIENT_HOME_TEXT.errors.load,
  });
  const upcomingAppointment = useMemo(
    () =>
      appointmentList.appointments.find((appointment) =>
        canManagePatientAppointment(appointment),
      ) ?? null,
    [appointmentList.appointments],
  );

  return {
    ...appointmentList,
    upcomingAppointment,
  };
}
