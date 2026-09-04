import type { Metadata } from "next";
import { DoctorDashboard } from "@/views/doctorDashboard/DoctorDashboard";
import { DOCTOR_DASHBOARD_TEXT } from "@/views/doctorDashboard/DoctorDashboardText";

export const metadata: Metadata = {
  title: DOCTOR_DASHBOARD_TEXT.metadataTitle,
};

export default function DoctorDashboardPage() {
  return <DoctorDashboard />;
}
