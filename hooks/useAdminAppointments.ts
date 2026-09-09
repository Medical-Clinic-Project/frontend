"use client";

import { useAdminAppointmentActions } from "@/hooks/useAdminAppointmentActions";
import { useAdminAppointmentFilters } from "@/hooks/useAdminAppointmentFilters";
import { useAdminAppointmentList } from "@/hooks/useAdminAppointmentList";
import { useAppointmentDetails } from "@/hooks/useAppointmentDetails";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

export function useAdminAppointments() {
  const filters = useAdminAppointmentFilters();
  const appointmentList = useAdminAppointmentList(filters.query);
  const appointmentDetails = useAppointmentDetails({
    loadErrorMessage: ADMIN_APPOINTMENTS_TEXT.errors.details,
  });
  const appointmentActions = useAdminAppointmentActions({
    refreshAppointments: appointmentList.refreshAppointments,
  });

  return {
    ...appointmentActions,
    ...appointmentDetails,
    ...appointmentList,
    ...filters,
  };
}
