"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPatients } from "@/api/patientsApi";
import { ADMIN_APPOINTMENT_SEARCH_DEBOUNCE_MS } from "@/constants/appointments";
import type { Patient } from "@/types/patient";
import { getUserFacingError } from "@/utils/apiErrors";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

interface UseAdminAppointmentPatientSearchOptions {
  onPatientIdChange: (patientId: number | null) => void;
}

function getPatientLabel(patient: Patient): string {
  return `${patient.fullName} (${patient.email})`;
}

export function useAdminAppointmentPatientSearch({
  onPatientIdChange,
}: UseAdminAppointmentPatientSearchOptions) {
  const [patientOptions, setPatientOptions] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSearch, setPatientSearchValue] = useState("");
  const [isPatientOptionsLoading, setIsPatientOptionsLoading] = useState(false);
  const [patientOptionsError, setPatientOptionsError] = useState<string | null>(
    null,
  );
  const patientLoadController = useRef<AbortController | null>(null);

  useEffect(() => {
    patientLoadController.current?.abort();
    const normalizedSearch = patientSearch.trim();

    const controller = new AbortController();
    patientLoadController.current = controller;
    const timeoutId = window.setTimeout(() => {
      if (!normalizedSearch) {
        setPatientOptions(selectedPatient ? [selectedPatient] : []);
        setPatientOptionsError(null);
        setIsPatientOptionsLoading(false);

        if (patientLoadController.current === controller) {
          patientLoadController.current = null;
        }

        return;
      }

      setIsPatientOptionsLoading(true);
      setPatientOptionsError(null);

      void getPatients({ search: normalizedSearch }, controller.signal)
        .then((patients) => {
          if (!controller.signal.aborted) {
            setPatientOptions(patients);
          }
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setPatientOptionsError(
              getUserFacingError(
                error,
                ADMIN_APPOINTMENTS_TEXT.errors.patientOptions,
              ),
            );
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsPatientOptionsLoading(false);
          }

          if (patientLoadController.current === controller) {
            patientLoadController.current = null;
          }
        });
    }, normalizedSearch ? ADMIN_APPOINTMENT_SEARCH_DEBOUNCE_MS : 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();

      if (patientLoadController.current === controller) {
        patientLoadController.current = null;
      }
    };
  }, [patientSearch, selectedPatient]);

  const setPatient = useCallback(
    (patient: Patient | null) => {
      setSelectedPatient(patient);
      setPatientSearchValue(patient ? getPatientLabel(patient) : "");
      onPatientIdChange(patient?.id ?? null);
    },
    [onPatientIdChange],
  );

  const setPatientSearch = useCallback(
    (value: string) => {
      setPatientSearchValue(value);

      if (selectedPatient && value !== getPatientLabel(selectedPatient)) {
        setSelectedPatient(null);
        onPatientIdChange(null);
      }
    },
    [onPatientIdChange, selectedPatient],
  );

  const clearPatientSearch = useCallback(() => {
    patientLoadController.current?.abort();
    patientLoadController.current = null;
    setSelectedPatient(null);
    setPatientSearchValue("");
    setPatientOptions([]);
    setPatientOptionsError(null);
  }, []);

  return {
    clearPatientSearch,
    isPatientOptionsLoading,
    patientOptions,
    patientOptionsError,
    patientSearch,
    selectedPatient,
    setPatient,
    setPatientSearch,
  };
}
