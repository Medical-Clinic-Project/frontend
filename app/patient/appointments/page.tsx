import type { Metadata } from "next";
import { PatientAppointments } from "@/views/patientAppointments/PatientAppointments";
import { PATIENT_APPOINTMENTS_TEXT } from "@/views/patientAppointments/PatientAppointmentsText";

export const metadata: Metadata = {
  title: PATIENT_APPOINTMENTS_TEXT.metadataTitle,
};

export default function PatientAppointmentsPage() {
  return <PatientAppointments />;
}
