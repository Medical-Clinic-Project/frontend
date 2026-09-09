"use client";

import { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getDoctorAppointmentsDataGridColumns } from "@/components/tables/DoctorAppointmentsDataGridColumns";
import { APPOINTMENT_STATUSES } from "@/constants/appointments";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { DOCTOR_APPOINTMENTS_TEXT } from "@/views/doctorAppointments/DoctorAppointmentsText";

interface DoctorAppointmentsDataGridProps {
  appointments: readonly Appointment[];
  onView: (appointment: Appointment) => void;
  onRequestStatusUpdate: (
    appointment: Appointment,
    status: Exclude<AppointmentStatus, typeof APPOINTMENT_STATUSES.PENDING>,
  ) => void;
  statusUpdatingId: number | null;
}

export function DoctorAppointmentsDataGrid({
  appointments,
  onView,
  onRequestStatusUpdate,
  statusUpdatingId,
}: DoctorAppointmentsDataGridProps) {
  const columns = useMemo(
    () =>
      getDoctorAppointmentsDataGridColumns({
        onView,
        onRequestStatusUpdate,
        statusUpdatingId,
      }),
    [onRequestStatusUpdate, onView, statusUpdatingId],
  );

  return (
    <DataGrid
      autoHeight
      columns={columns}
      disableColumnFilter
      disableColumnMenu
      disableColumnSorting
      disableRowSelectionOnClick
      hideFooter
      label={DOCTOR_APPOINTMENTS_TEXT.accessibility.tableLabel}
      rows={appointments}
    />
  );
}
