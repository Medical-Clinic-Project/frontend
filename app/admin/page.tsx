import type { Metadata } from "next";
import { RoleHome } from "@/views/dashboard/RoleHome";

export const metadata: Metadata = {
  title: "Admin workspace",
};

export default function AdminPage() {
  return <RoleHome role="Admin" />;
}
