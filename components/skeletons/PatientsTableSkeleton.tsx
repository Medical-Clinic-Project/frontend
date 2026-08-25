import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { PATIENTS_TEXT } from "@/views/patients/Patients.text";

export function PatientsTableSkeleton() {
  return <TableSkeleton label={PATIENTS_TEXT.loading} />;
}
