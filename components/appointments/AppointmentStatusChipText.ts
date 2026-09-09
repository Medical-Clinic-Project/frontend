import { APPOINTMENT_STATUSES } from "@/constants/appointments";
import type { AppointmentStatus } from "@/types/appointment";

const statusLabels: Record<AppointmentStatus, string> = {
  [APPOINTMENT_STATUSES.PENDING]: "Pending",
  [APPOINTMENT_STATUSES.CONFIRMED]: "Confirmed",
  [APPOINTMENT_STATUSES.COMPLETED]: "Completed",
  [APPOINTMENT_STATUSES.CANCELLED]: "Cancelled",
};

export function getAppointmentStatusLabel(status: AppointmentStatus): string {
  return statusLabels[status];
}
