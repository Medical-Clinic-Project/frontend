import { Chip, type ChipProps } from "@mui/material";
import { APPOINTMENT_STATUSES } from "@/constants/appointments";
import { getAppointmentStatusLabel } from "@/components/appointments/AppointmentStatusChipText";
import type { AppointmentStatus } from "@/types/appointment";

interface AppointmentStatusChipProps {
  status: AppointmentStatus;
}

const statusColors: Record<AppointmentStatus, ChipProps["color"]> = {
  [APPOINTMENT_STATUSES.PENDING]: "warning",
  [APPOINTMENT_STATUSES.CONFIRMED]: "primary",
  [APPOINTMENT_STATUSES.COMPLETED]: "success",
  [APPOINTMENT_STATUSES.CANCELLED]: "default",
};

export function AppointmentStatusChip({ status }: AppointmentStatusChipProps) {
  return (
    <Chip
      color={statusColors[status]}
      label={getAppointmentStatusLabel(status)}
      size="small"
      variant={status === APPOINTMENT_STATUSES.CANCELLED ? "outlined" : "filled"}
    />
  );
}
