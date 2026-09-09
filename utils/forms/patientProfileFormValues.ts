import type { Patient } from "@/types/patient";
import type { PatientProfileFormValues } from "@/utils/validation/patientProfileValidation";

export function getPatientProfileFormValues(
  patient: Pick<Patient, "fullName" | "email">,
): PatientProfileFormValues {
  return {
    fullName: patient.fullName,
    email: patient.email,
  };
}
