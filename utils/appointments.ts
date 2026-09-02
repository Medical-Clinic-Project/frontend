import {
  APPOINTMENT_STATUSES,
  DOCTOR_APPOINTMENT_TAB_VALUES,
  PATIENT_APPOINTMENT_TABS,
} from "@/constants/appointments";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

export type PatientAppointmentTab =
  (typeof PATIENT_APPOINTMENT_TABS)[keyof typeof PATIENT_APPOINTMENT_TABS];

export type DoctorAppointmentTab =
  (typeof DOCTOR_APPOINTMENT_TAB_VALUES)[number];

const actionableStatuses: readonly AppointmentStatus[] = [
  APPOINTMENT_STATUSES.PENDING,
  APPOINTMENT_STATUSES.CONFIRMED,
];

export function canManagePatientAppointment(appointment: Appointment): boolean {
  return (
    actionableStatuses.includes(appointment.status) &&
    new Date(appointment.startTime) > new Date()
  );
}

export function canConfirmDoctorAppointment(appointment: Appointment): boolean {
  return appointment.status === APPOINTMENT_STATUSES.PENDING;
}

export function canCompleteDoctorAppointment(appointment: Appointment): boolean {
  return (
    appointment.status === APPOINTMENT_STATUSES.CONFIRMED &&
    new Date(appointment.endTime) <= new Date()
  );
}

export function canCancelDoctorAppointment(appointment: Appointment): boolean {
  return (
    appointment.status === APPOINTMENT_STATUSES.PENDING ||
    appointment.status === APPOINTMENT_STATUSES.CONFIRMED
  );
}

export function canUpdateDoctorAppointmentStatus(
  appointment: Appointment,
  nextStatus: AppointmentStatus,
): boolean {
  if (nextStatus === APPOINTMENT_STATUSES.CONFIRMED) {
    return canConfirmDoctorAppointment(appointment);
  }

  if (nextStatus === APPOINTMENT_STATUSES.COMPLETED) {
    return canCompleteDoctorAppointment(appointment);
  }

  if (nextStatus === APPOINTMENT_STATUSES.CANCELLED) {
    return canCancelDoctorAppointment(appointment);
  }

  return false;
}

export function getPatientAppointmentTab(
  appointment: Appointment,
): PatientAppointmentTab {
  if (appointment.status === APPOINTMENT_STATUSES.COMPLETED) {
    return PATIENT_APPOINTMENT_TABS.COMPLETED;
  }

  if (appointment.status === APPOINTMENT_STATUSES.CANCELLED) {
    return PATIENT_APPOINTMENT_TABS.CANCELLED;
  }

  return PATIENT_APPOINTMENT_TABS.UPCOMING;
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
