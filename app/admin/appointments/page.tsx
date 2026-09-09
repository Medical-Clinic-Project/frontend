import type { Metadata } from "next";
import { AdminAppointments } from "@/views/adminAppointments/AdminAppointments";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

export const metadata: Metadata = {
  title: ADMIN_APPOINTMENTS_TEXT.metadataTitle,
};

export default function AdminAppointmentsPage() {
  return <AdminAppointments />;
}
