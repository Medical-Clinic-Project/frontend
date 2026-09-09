import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { CircularProgress } from "@mui/material";
import {
  GridActionsCell,
  GridActionsCellItem,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { ADMIN_APPOINTMENT_STATUS_ACTION_CONFIGS } from "@/constants/appointments";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import {
  canRescheduleAdminAppointment,
  canUpdateAdminAppointmentStatus,
} from "@/utils/appointments";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

interface AdminAppointmentActionsCellProps {
  params: GridRenderCellParams<Appointment>;
  statusUpdatingId: number | null;
  reschedulingId: number | null;
  onView: (appointment: Appointment) => void;
  onRequestStatusUpdate: (
    appointment: Appointment,
    status: Exclude<AppointmentStatus, "Pending">,
  ) => void;
  onRequestReschedule: (appointment: Appointment) => void;
}

type StatusActionIcon =
  (typeof ADMIN_APPOINTMENT_STATUS_ACTION_CONFIGS)[number]["icon"];

function StatusActionIcon({ icon }: { icon: StatusActionIcon }) {
  if (icon === "confirm") {
    return <CheckCircleOutlinedIcon color="primary" />;
  }

  if (icon === "complete") {
    return <DoneAllOutlinedIcon color="success" />;
  }

  return <CancelOutlinedIcon color="error" />;
}

export function AdminAppointmentActionsCell({
  params,
  statusUpdatingId,
  reschedulingId,
  onView,
  onRequestStatusUpdate,
  onRequestReschedule,
}: AdminAppointmentActionsCellProps) {
  const appointment = params.row;
  const isStatusUpdating = statusUpdatingId === appointment.id;
  const isRescheduling = reschedulingId === appointment.id;

  return (
    <GridActionsCell {...params}>
      <GridActionsCellItem
        icon={<VisibilityOutlinedIcon />}
        label={ADMIN_APPOINTMENTS_TEXT.accessibility.viewAppointment(
          appointment.patientName,
        )}
        onClick={() => onView(appointment)}
      />
      {ADMIN_APPOINTMENT_STATUS_ACTION_CONFIGS.filter(({ status }) =>
        canUpdateAdminAppointmentStatus(appointment, status),
      ).map(({ status, icon, labelKey }) => (
        <GridActionsCellItem
          key={status}
          icon={
            isStatusUpdating ? (
              <CircularProgress
                size={20}
                aria-label={ADMIN_APPOINTMENTS_TEXT.actions.updating}
              />
            ) : (
              <StatusActionIcon icon={icon} />
            )
          }
          label={ADMIN_APPOINTMENTS_TEXT.accessibility[labelKey](
            appointment.patientName,
          )}
          disabled={isStatusUpdating}
          onClick={() => onRequestStatusUpdate(appointment, status)}
        />
      ))}
      {canRescheduleAdminAppointment(appointment) && (
        <GridActionsCellItem
          icon={
            isRescheduling ? (
              <CircularProgress
                size={20}
                aria-label={ADMIN_APPOINTMENTS_TEXT.actions.rescheduling}
              />
            ) : (
              <EditCalendarOutlinedIcon color="primary" />
            )
          }
          label={ADMIN_APPOINTMENTS_TEXT.accessibility.rescheduleAppointment(
            appointment.patientName,
          )}
          disabled={isRescheduling}
          onClick={() => onRequestReschedule(appointment)}
        />
      )}
    </GridActionsCell>
  );
}
