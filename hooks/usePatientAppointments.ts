"use client";

import { useState } from "react";
import { usePatientAppointmentActions } from "@/hooks/usePatientAppointmentActions";
import { usePatientAppointmentDetails } from "@/hooks/usePatientAppointmentDetails";
import { usePatientAppointmentList } from "@/hooks/usePatientAppointmentList";
import type { PatientAppointmentTab } from "@/utils/appointments";

export function usePatientAppointments() {
  const [tab, setTab] = useState<PatientAppointmentTab>("upcoming");
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
