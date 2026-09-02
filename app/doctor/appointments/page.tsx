import type { Metadata } from "next";
import { DoctorAppointments } from "@/views/doctorAppointments/DoctorAppointments";
import { DOCTOR_APPOINTMENTS_TEXT } from "@/views/doctorAppointments/DoctorAppointmentsText";

export const metadata: Metadata = {
  title: DOCTOR_APPOINTMENTS_TEXT.metadataTitle,
};

export default function DoctorAppointmentsPage() {
  return <DoctorAppointments />;
}
