import type { Metadata } from "next";
import { RoleHome } from "@/views/dashboard/RoleHome";

export const metadata: Metadata = {
  title: "Patient workspace",
};

export default function PatientPage() {
  return <RoleHome />;
}
