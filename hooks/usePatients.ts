"use client";

import { usePatientDetails } from "@/hooks/usePatientDetails";
import { usePatientFilters } from "@/hooks/usePatientFilters";
import { usePatientStatus } from "@/hooks/usePatientStatus";

export function usePatients() {
  const patientFilters = usePatientFilters();
  const patientDetails = usePatientDetails();
  const patientStatus = usePatientStatus({
    onStatusUpdated: patientFilters.refreshPatients,
  });

  return {
    ...patientFilters,
    ...patientDetails,
    ...patientStatus,
  };
}
