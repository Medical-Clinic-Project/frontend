import {
  APPOINTMENT_STATUS_VALUES,
  PATIENT_APPOINTMENT_TAB_VALUES,
} from "@/constants/appointments";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

export type PatientAppointmentTab =
  (typeof PATIENT_APPOINTMENT_TAB_VALUES)[number];

const actionableStatuses: readonly AppointmentStatus[] = [
  APPOINTMENT_STATUS_VALUES[0],
  APPOINTMENT_STATUS_VALUES[1],
];

export function canManagePatientAppointment(appointment: Appointment): boolean {
  return (
    actionableStatuses.includes(appointment.status) &&
    new Date(appointment.startTime) > new Date()
  );
}

export function getPatientAppointmentTab(
  appointment: Appointment,
): PatientAppointmentTab {
  if (appointment.status === APPOINTMENT_STATUS_VALUES[2]) {
    return "completed";
  }

  if (appointment.status === APPOINTMENT_STATUS_VALUES[3]) {
    return "cancelled";
  }

  return "upcoming";
}

export function sortAppointmentsByStartTime(
  appointments: readonly Appointment[],
): Appointment[] {
  return [...appointments].sort((left, right) => {
    const timeDifference =
      new Date(left.startTime).getTime() - new Date(right.startTime).getTime();

    return timeDifference || left.id - right.id;
  });
}
