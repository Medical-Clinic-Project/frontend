import type { Metadata } from "next";
import { AdminDashboard } from "@/views/adminDashboard/AdminDashboard";
import { ADMIN_DASHBOARD_TEXT } from "@/views/adminDashboard/AdminDashboardText";

export const metadata: Metadata = {
  title: ADMIN_DASHBOARD_TEXT.metadataTitle,
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
