import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PatientDoctorDetails } from "@/views/patientDoctors/PatientDoctorDetails";
import { PATIENT_DOCTORS_TEXT } from "@/views/patientDoctors/PatientDoctorsText";

export const metadata: Metadata = {
  title: PATIENT_DOCTORS_TEXT.details.title,
};

export default async function PatientDoctorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctorId = Number(id);

  if (!Number.isInteger(doctorId) || doctorId <= 0) {
    notFound();
  }

  return <PatientDoctorDetails doctorId={doctorId} />;
}
