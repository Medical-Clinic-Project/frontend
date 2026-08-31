import type { Metadata } from "next";
import { Patients } from "@/views/patients/Patients";
import { PATIENTS_TEXT } from "@/views/patients/PatientsText";

export const metadata: Metadata = {
  title: PATIENTS_TEXT.metadataTitle,
};

export default function PatientsPage() {
  return <Patients />;
}
