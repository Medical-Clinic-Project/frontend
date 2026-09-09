"use client";

import { useState } from "react";
import { PATIENT_APPOINTMENT_TABS } from "@/constants/appointments";
import { usePatientAppointmentActions } from "@/hooks/usePatientAppointmentActions";
import { usePatientAppointmentDetails } from "@/hooks/usePatientAppointmentDetails";
import { usePatientAppointmentList } from "@/hooks/usePatientAppointmentList";
import type { PatientAppointmentTab } from "@/utils/appointments";

export function usePatientAppointments() {
  const [tab, setTab] = useState<PatientAppointmentTab>(
    PATIENT_APPOINTMENT_TABS.UPCOMING,
  );
  const appointmentList = usePatientAppointmentList();
  const appointmentDetails = usePatientAppointmentDetails();
  const appointmentActions = usePatientAppointmentActions({
    refreshAppointments: appointmentList.refreshAppointments,
  });

  return {
    ...appointmentActions,
    ...appointmentDetails,
    ...appointmentList,
    setTab,
    tab,
  };
}
