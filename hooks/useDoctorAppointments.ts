"use client";

import { useAppointmentDetails } from "@/hooks/useAppointmentDetails";
import { useDoctorAppointmentActions } from "@/hooks/useDoctorAppointmentActions";
import { useDoctorAppointmentList } from "@/hooks/useDoctorAppointmentList";
import { DOCTOR_APPOINTMENTS_TEXT } from "@/views/doctorAppointments/DoctorAppointmentsText";

export function useDoctorAppointments() {
  const appointmentList = useDoctorAppointmentList();
  const appointmentDetails = useAppointmentDetails({
    loadErrorMessage: DOCTOR_APPOINTMENTS_TEXT.errors.details,
  });
  const appointmentActions = useDoctorAppointmentActions({
    refreshAppointments: appointmentList.refreshAppointments,
  });

  return {
    ...appointmentActions,
    ...appointmentDetails,
    ...appointmentList,
  };
}
