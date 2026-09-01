import { APPOINTMENT_STATUS_VALUES } from "@/constants/appointments";
import type { AppointmentStatus } from "@/types/appointment";

const statusLabels: Record<AppointmentStatus, string> = {
  [APPOINTMENT_STATUS_VALUES[0]]: "Pending",
  [APPOINTMENT_STATUS_VALUES[1]]: "Confirmed",
  [APPOINTMENT_STATUS_VALUES[2]]: "Completed",
  [APPOINTMENT_STATUS_VALUES[3]]: "Cancelled",
};

export function getAppointmentStatusLabel(status: AppointmentStatus): string {
  return statusLabels[status];
}
