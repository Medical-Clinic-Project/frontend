import type { Doctor } from "@/types/doctor";
import type { UpdateDoctorFormValues } from "@/utils/validation/doctorValidation";

export function getDoctorUpdateFormValues(
  doctor: Doctor,
): UpdateDoctorFormValues {
  return {
    mode: "edit",
    fullName: doctor.fullName,
    email: doctor.email,
    departmentId: doctor.departmentId,
  };
}
