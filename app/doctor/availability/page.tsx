import type { Metadata } from "next";
import { DoctorAvailabilityView } from "@/views/doctorAvailability/DoctorAvailabilityView";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityText";

export const metadata: Metadata = {
  title: DOCTOR_AVAILABILITY_TEXT.metadataTitle,
};

export default function DoctorAvailabilityPage() {
  return <DoctorAvailabilityView />;
}
