import type { Metadata } from "next";
import { RoleHome } from "@/views/dashboard/RoleHome";

export const metadata: Metadata = {
  title: "Doctor workspace",
};

export default function DoctorPage() {
  return <RoleHome role="Doctor" />;
}
