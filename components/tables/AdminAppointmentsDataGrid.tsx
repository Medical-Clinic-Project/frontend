"use client";

import { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";
import { getAdminAppointmentColumns } from "./AdminAppointmentsDataGridColumns";

interface AdminAppointmentsDataGridProps {
  appointments: readonly Appointment[];
  statusUpdatingId: number | null;
  reschedulingId: number | null;
  onView: (appointment: Appointment) => void;
  onRequestStatusUpdate: (
    appointment: Appointment,
    status: Exclude<AppointmentStatus, "Pending">,
  ) => void;
  onRequestReschedule: (appointment: Appointment) => void;
}

export function AdminAppointmentsDataGrid({
  appointments,
  statusUpdatingId,
  reschedulingId,
  onView,
  onRequestStatusUpdate,
  onRequestReschedule,
}: AdminAppointmentsDataGridProps) {
  const columns = useMemo(
    () =>
      getAdminAppointmentColumns({
        statusUpdatingId,
        reschedulingId,
        onView,
        onRequestStatusUpdate,
        onRequestReschedule,
      }),
    [onRequestReschedule, onRequestStatusUpdate, onView, reschedulingId, statusUpdatingId],
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
      label={ADMIN_APPOINTMENTS_TEXT.accessibility.tableLabel}
      rows={appointments}
    />
  );
}
