import type { Metadata } from "next";
import { PatientHome } from "@/views/patientHome/PatientHome";
import { PATIENT_HOME_TEXT } from "@/views/patientHome/PatientHomeText";

export const metadata: Metadata = {
  title: PATIENT_HOME_TEXT.metadataTitle,
};

export default function PatientPage() {
  return <PatientHome />;
}
