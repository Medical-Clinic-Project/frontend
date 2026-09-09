import type { Metadata } from "next";
import { Doctors } from "@/views/doctors/Doctors";
import { DOCTORS_TEXT } from "@/views/doctors/DoctorsText";

export const metadata: Metadata = {
  title: DOCTORS_TEXT.metadataTitle,
};

export default function DoctorsPage() {
  return <Doctors />;
}
