import {
  createElement,
  type ComponentProps,
  type ComponentType,
  type ReactElement,
} from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { CircularProgress, Tooltip, Typography } from "@mui/material";
import {
  GridActionsCell,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import { AppointmentStatusChip } from "@/components/appointments/AppointmentStatusChip";
import {
  ADMIN_APPOINTMENT_GRID_COLUMN_WIDTHS,
  ADMIN_APPOINTMENT_GRID_FIELDS,
} from "@/constants/appointments";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import {
  canRescheduleAdminAppointment,
  canUpdateAdminAppointmentStatus,
} from "@/utils/appointments";
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

interface StatusActionConfig {
  status: Exclude<AppointmentStatus, "Pending">;
  createIcon: () => ReactElement;
  label: (patientName: string) => string;
}

const AdminAppointmentActionsCell = GridActionsCell as ComponentType<
  Omit<ComponentProps<typeof GridActionsCell>, "children">
>;

const TooltipWithoutChildren = Tooltip as ComponentType<
  Omit<ComponentProps<typeof Tooltip>, "children">
>;

const STATUS_ACTION_CONFIGS: readonly StatusActionConfig[] = [
  {
    status: "Confirmed",
    createIcon: () => createElement(CheckCircleOutlinedIcon, { color: "primary" }),
    label: ADMIN_APPOINTMENTS_TEXT.accessibility.confirmAppointment,
  },
  {
    status: "Completed",
    createIcon: () => createElement(DoneAllOutlinedIcon, { color: "success" }),
    label: ADMIN_APPOINTMENTS_TEXT.accessibility.completeAppointment,
  },
  {
    status: "Cancelled",
    createIcon: () => createElement(CancelOutlinedIcon, { color: "error" }),
    label: ADMIN_APPOINTMENTS_TEXT.accessibility.cancelAppointment,
  },
];

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
          params,
          ...getAdminAppointmentActionItems(params.row, {
            statusUpdatingId,
            reschedulingId,
            onView,
            onRequestStatusUpdate,
            onRequestReschedule,
          }),
        ),
    },
  ];
}

function getAdminAppointmentActionItems(
  appointment: Appointment,
  {
    statusUpdatingId,
    reschedulingId,
    onView,
    onRequestStatusUpdate,
    onRequestReschedule,
  }: GetAdminAppointmentColumnsOptions,
) {
  const isStatusUpdating = statusUpdatingId === appointment.id;
  const isRescheduling = reschedulingId === appointment.id;
  const statusIcon = createElement(CircularProgress, {
    size: 20,
    "aria-label": ADMIN_APPOINTMENTS_TEXT.actions.updating,
  });
  const statusActionItems = STATUS_ACTION_CONFIGS.filter(({ status }) =>
    canUpdateAdminAppointmentStatus(appointment, status),
  ).map(({ status, createIcon, label }) =>
    createElement(GridActionsCellItem, {
      icon: getActionIcon(isStatusUpdating, statusIcon, createIcon()),
      label: label(appointment.patientName),
      disabled: isStatusUpdating,
      onClick: () => onRequestStatusUpdate(appointment, status),
    }),
  );
  const actionItems = [
    createElement(GridActionsCellItem, {
      icon: createElement(VisibilityOutlinedIcon),
      label: ADMIN_APPOINTMENTS_TEXT.accessibility.viewAppointment(appointment.patientName),
      onClick: () => onView(appointment),
    }),
    ...statusActionItems,
  ];

  if (canRescheduleAdminAppointment(appointment)) {
    actionItems.push(
      createElement(GridActionsCellItem, {
        icon: getActionIcon(
          isRescheduling,
          createElement(CircularProgress, {
            size: 20,
            "aria-label": ADMIN_APPOINTMENTS_TEXT.actions.rescheduling,
          }),
          createElement(EditCalendarOutlinedIcon, { color: "primary" }),
        ),
        label: ADMIN_APPOINTMENTS_TEXT.accessibility.rescheduleAppointment(
          appointment.patientName,
        ),
        disabled: isRescheduling,
        onClick: () => onRequestReschedule(appointment),
      }),
    );
  }

  return actionItems;
}

function getActionIcon(
  isLoading: boolean,
  loadingIcon: ReactElement,
  defaultIcon: ReactElement,
): ReactElement {
  return isLoading ? loadingIcon : defaultIcon;
}

function NameCell({ value }: { value: string }) {
  return createElement(
    TooltipWithoutChildren,
    { title: value, arrow: true },
    createElement(Typography, { variant: "body2", noWrap: true }, value),
  );
}
