import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Doctor workspace",
};

export default function DoctorPage() {
  redirect(APP_ROUTES.doctorDashboard);
}
