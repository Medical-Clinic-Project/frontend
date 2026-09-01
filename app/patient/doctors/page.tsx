import type { Metadata } from "next";
import { PatientDoctors } from "@/views/patientDoctors/PatientDoctors";
import { PATIENT_DOCTORS_TEXT } from "@/views/patientDoctors/PatientDoctorsText";

export const metadata: Metadata = {
  title: PATIENT_DOCTORS_TEXT.metadataTitle,
};

export default function PatientDoctorsPage() {
  return <PatientDoctors />;
}
