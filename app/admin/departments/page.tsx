import type { Metadata } from "next";
import { Departments } from "@/views/departments/Departments";
import { DEPARTMENTS_TEXT } from "@/views/departments/Departments.text";

export const metadata: Metadata = {
  title: DEPARTMENTS_TEXT.metadataTitle,
};

export default function DepartmentsPage() {
  return <Departments />;
}
