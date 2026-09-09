import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Admin workspace",
};

export default function AdminPage() {
  redirect(APP_ROUTES.adminDashboard);
}
