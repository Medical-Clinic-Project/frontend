import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { CircularProgress, Tooltip, Typography } from "@mui/material";
import {
  GridActionsCell,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import { AppointmentStatusChip } from "@/components/appointments/AppointmentStatusChip";
import {
  APPOINTMENT_STATUSES,
  DOCTOR_APPOINTMENT_GRID_COLUMN_WIDTHS,
  DOCTOR_APPOINTMENT_GRID_FIELDS,
} from "@/constants/appointments";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { formatDateTimeRange } from "@/utils/doctorAvailability/dateTime";
import {
  canCancelDoctorAppointment,
  canCompleteDoctorAppointment,
  canConfirmDoctorAppointment,
  getStatusUpdatingLabel,
} from "@/utils/appointments";
import { DOCTOR_APPOINTMENTS_TEXT } from "@/views/doctorAppointments/DoctorAppointmentsText";

interface DoctorAppointmentsDataGridColumnOptions {
  onView: (appointment: Appointment) => void;
  onRequestStatusUpdate: (
    appointment: Appointment,
    status: Exclude<AppointmentStatus, typeof APPOINTMENT_STATUSES.PENDING>,
  ) => void;
  statusUpdatingId: number | null;
}

export function getDoctorAppointmentsDataGridColumns({
  onView,
  onRequestStatusUpdate,
  statusUpdatingId,
}: DoctorAppointmentsDataGridColumnOptions): GridColDef<Appointment>[] {
  return [
    {
      field: DOCTOR_APPOINTMENT_GRID_FIELDS.patientName,
      headerName: DOCTOR_APPOINTMENTS_TEXT.table.patient,
      rowHeader: true,
      flex: 1,
      minWidth: DOCTOR_APPOINTMENT_GRID_COLUMN_WIDTHS.patientName,
      renderCell: (params) => (
        <Tooltip title={params.row.patientName} arrow>
          <Typography variant="body2" noWrap>
            {params.row.patientName}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: DOCTOR_APPOINTMENT_GRID_FIELDS.appointmentTime,
      headerName: DOCTOR_APPOINTMENTS_TEXT.table.appointmentTime,
      flex: 1,
      minWidth: DOCTOR_APPOINTMENT_GRID_COLUMN_WIDTHS.appointmentTime,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {formatDateTimeRange(params.row.startTime, params.row.endTime)}
        </Typography>
      ),
    },
    {
      field: DOCTOR_APPOINTMENT_GRID_FIELDS.status,
      headerName: DOCTOR_APPOINTMENTS_TEXT.table.status,
      minWidth: DOCTOR_APPOINTMENT_GRID_COLUMN_WIDTHS.status,
      sortable: false,
      filterable: false,
      renderCell: (params) => <AppointmentStatusChip status={params.row.status} />,
    },
    {
      field: DOCTOR_APPOINTMENT_GRID_FIELDS.reason,
      headerName: DOCTOR_APPOINTMENTS_TEXT.table.reason,
      flex: 1,
      minWidth: DOCTOR_APPOINTMENT_GRID_COLUMN_WIDTHS.reason,
      renderCell: (params) => {
        const reason =
          params.row.reason || DOCTOR_APPOINTMENTS_TEXT.table.notProvided;

        return (
          <Tooltip title={reason} arrow>
            <Typography variant="body2" color="text.secondary" noWrap>
              {reason}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: DOCTOR_APPOINTMENT_GRID_FIELDS.actions,
      type: "actions",
      headerName: DOCTOR_APPOINTMENTS_TEXT.table.actions,
      minWidth: DOCTOR_APPOINTMENT_GRID_COLUMN_WIDTHS.actions,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const appointment = params.row;
        const isUpdating = statusUpdatingId === appointment.id;
        const loadingIcon = (
          <CircularProgress
            size={20}
            aria-label={getStatusUpdatingLabel(appointment.status)}
          />
        );

        return (
          <GridActionsCell {...params}>
            <GridActionsCellItem
              icon={<VisibilityOutlinedIcon />}
              label={DOCTOR_APPOINTMENTS_TEXT.accessibility.viewAppointment(
                appointment.patientName,
              )}
              onClick={() => onView(appointment)}
            />
            {canConfirmDoctorAppointment(appointment) && (
              <GridActionsCellItem
                icon={isUpdating ? loadingIcon : <CheckCircleOutlinedIcon color="primary" />}
                label={DOCTOR_APPOINTMENTS_TEXT.accessibility.confirmAppointment(
                  appointment.patientName,
                )}
                disabled={isUpdating}
                onClick={() =>
                  onRequestStatusUpdate(
                    appointment,
                    APPOINTMENT_STATUSES.CONFIRMED,
                  )
                }
              />
            )}
            {canCompleteDoctorAppointment(appointment) && (
              <GridActionsCellItem
                icon={isUpdating ? loadingIcon : <DoneAllOutlinedIcon color="success" />}
                label={DOCTOR_APPOINTMENTS_TEXT.accessibility.completeAppointment(
                  appointment.patientName,
                )}
                disabled={isUpdating}
                onClick={() =>
                  onRequestStatusUpdate(
                    appointment,
                    APPOINTMENT_STATUSES.COMPLETED,
                  )
                }
              />
            )}
            {canCancelDoctorAppointment(appointment) && (
              <GridActionsCellItem
                icon={isUpdating ? loadingIcon : <CancelOutlinedIcon color="error" />}
                label={DOCTOR_APPOINTMENTS_TEXT.accessibility.cancelAppointment(
                  appointment.patientName,
                )}
                disabled={isUpdating}
                onClick={() =>
                  onRequestStatusUpdate(
                    appointment,
                    APPOINTMENT_STATUSES.CANCELLED,
                  )
                }
              />
            )}
          </GridActionsCell>
        );
      },
    },
  ];
}
