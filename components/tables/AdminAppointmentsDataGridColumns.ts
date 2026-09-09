import {
  createElement,
  type ComponentProps,
  type ComponentType,
} from "react";
import { Tooltip, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { AppointmentStatusChip } from "@/components/appointments/AppointmentStatusChip";
import { AdminAppointmentActionsCell } from "@/components/tables/AdminAppointmentActionsCell";
import {
  ADMIN_APPOINTMENT_GRID_COLUMN_WIDTHS,
  ADMIN_APPOINTMENT_GRID_FIELDS,
} from "@/constants/appointments";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { formatDateTimeRange } from "@/utils/doctorAvailability/dateTime";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

interface GetAdminAppointmentColumnsOptions {
  statusUpdatingId: number | null;
  reschedulingId: number | null;
  onView: (appointment: Appointment) => void;
  onRequestStatusUpdate: (
    appointment: Appointment,
    status: Exclude<AppointmentStatus, "Pending">,
  ) => void;
  onRequestReschedule: (appointment: Appointment) => void;
}

const TooltipWithoutChildren = Tooltip as ComponentType<
  Omit<ComponentProps<typeof Tooltip>, "children">
>;

export function getAdminAppointmentColumns({
  statusUpdatingId,
  reschedulingId,
  onView,
  onRequestStatusUpdate,
  onRequestReschedule,
}: GetAdminAppointmentColumnsOptions): GridColDef<Appointment>[] {
  return [
    {
      field: ADMIN_APPOINTMENT_GRID_FIELDS.patientName,
      headerName: ADMIN_APPOINTMENTS_TEXT.table.patient,
      rowHeader: true,
      flex: 1,
      minWidth: ADMIN_APPOINTMENT_GRID_COLUMN_WIDTHS.patientName,
      renderCell: (params) => createElement(NameCell, { value: params.row.patientName }),
    },
    {
      field: ADMIN_APPOINTMENT_GRID_FIELDS.doctorName,
      headerName: ADMIN_APPOINTMENTS_TEXT.table.doctor,
      flex: 1,
      minWidth: ADMIN_APPOINTMENT_GRID_COLUMN_WIDTHS.doctorName,
      renderCell: (params) => createElement(NameCell, { value: params.row.doctorName }),
    },
    {
      field: ADMIN_APPOINTMENT_GRID_FIELDS.departmentName,
      headerName: ADMIN_APPOINTMENTS_TEXT.table.department,
      flex: 1,
      minWidth: ADMIN_APPOINTMENT_GRID_COLUMN_WIDTHS.departmentName,
      renderCell: (params) => createElement(NameCell, { value: params.row.departmentName }),
    },
    {
      field: ADMIN_APPOINTMENT_GRID_FIELDS.appointmentTime,
      headerName: ADMIN_APPOINTMENTS_TEXT.table.appointmentTime,
      flex: 1,
      minWidth: ADMIN_APPOINTMENT_GRID_COLUMN_WIDTHS.appointmentTime,
      renderCell: (params) =>
        createElement(
          Typography,
          { variant: "body2", color: "text.secondary", noWrap: true },
          formatDateTimeRange(params.row.startTime, params.row.endTime),
        ),
    },
    {
      field: ADMIN_APPOINTMENT_GRID_FIELDS.status,
      headerName: ADMIN_APPOINTMENTS_TEXT.table.status,
      minWidth: ADMIN_APPOINTMENT_GRID_COLUMN_WIDTHS.status,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        createElement(AppointmentStatusChip, { status: params.row.status }),
    },
    {
      field: ADMIN_APPOINTMENT_GRID_FIELDS.actions,
      type: "actions",
      headerName: ADMIN_APPOINTMENTS_TEXT.table.actions,
      minWidth: ADMIN_APPOINTMENT_GRID_COLUMN_WIDTHS.actions,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        createElement(
          AdminAppointmentActionsCell,
          {
            params,
            statusUpdatingId,
            reschedulingId,
            onView,
            onRequestStatusUpdate,
            onRequestReschedule,
          },
        ),
    },
  ];
}

function NameCell({ value }: { value: string }) {
  return createElement(
    TooltipWithoutChildren,
    { title: value, arrow: true },
    createElement(Typography, { variant: "body2", noWrap: true }, value),
  );
}
