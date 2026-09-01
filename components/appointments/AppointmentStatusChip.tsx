import { Chip } from "@mui/material";
import { APPOINTMENT_STATUS_VALUES } from "@/constants/appointments";
import { getAppointmentStatusLabel } from "@/components/appointments/AppointmentStatusChip.text";
import type { AppointmentStatus } from "@/types/appointment";

interface AppointmentStatusChipProps {
  status: AppointmentStatus;
}

export function AppointmentStatusChip({ status }: AppointmentStatusChipProps) {
  const color =
    status === APPOINTMENT_STATUS_VALUES[2]
      ? "success"
      : status === APPOINTMENT_STATUS_VALUES[3]
        ? "default"
        : status === APPOINTMENT_STATUS_VALUES[1]
          ? "primary"
          : "warning";

  return (
    <Chip
      color={color}
      label={getAppointmentStatusLabel(status)}
      size="small"
      variant={status === APPOINTMENT_STATUS_VALUES[3] ? "outlined" : "filled"}
    />
  );
}
