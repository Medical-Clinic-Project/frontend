import type { Metadata } from "next";
import { PatientProfile } from "@/views/patientProfile/PatientProfile";
import { PATIENT_PROFILE_TEXT } from "@/views/patientProfile/PatientProfile.text";

export const metadata: Metadata = {
  title: PATIENT_PROFILE_TEXT.metadataTitle,
};

export default function PatientProfilePage() {
  return <PatientProfile />;
}
