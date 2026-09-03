"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDepartments } from "@/api/departmentsApi";
import { getDoctors } from "@/api/doctorsApi";
import { getPatients } from "@/api/patientsApi";
import type { AppointmentQuery, AppointmentStatus } from "@/types/appointment";
import type { Department } from "@/types/department";
import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";
import { getUserFacingError } from "@/utils/apiErrors";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

const SEARCH_DEBOUNCE_MS = 300;

interface FilterValues {
  search: string;
  status: AppointmentStatus | null;
  doctorId: number | null;
  patientId: number | null;
  departmentId: number | null;
  appointmentDate: string;
}

const emptyFilterValues: FilterValues = {
  search: "",
  status: null,
  doctorId: null,
  patientId: null,
  departmentId: null,
  appointmentDate: "",
};

function getDateRange(appointmentDate: string): Pick<AppointmentQuery, "from" | "to"> {
  if (!appointmentDate) {
    return {};
  }

  const start = new Date(`${appointmentDate}T00:00:00`);

  if (Number.isNaN(start.getTime())) {
    return {};
  }

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { from: start.toISOString(), to: end.toISOString() };
}

function getPatientLabel(patient: Patient): string {
  return `${patient.fullName} (${patient.email})`;
}

export function useAdminAppointmentFilters() {
  const [filters, setFilters] = useState<FilterValues>(emptyFilterValues);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isFilterOptionsLoading, setIsFilterOptionsLoading] = useState(true);
  const [filterOptionsError, setFilterOptionsError] = useState<string | null>(null);
  const [patientOptions, setPatientOptions] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [isPatientOptionsLoading, setIsPatientOptionsLoading] = useState(false);
  const [patientOptionsError, setPatientOptionsError] = useState<string | null>(null);
  const patientLoadController = useRef<AbortController | null>(null);

  const loadFilterOptions = useCallback(async (signal?: AbortSignal): Promise<void> => {
    setIsFilterOptionsLoading(true);
    setFilterOptionsError(null);

    try {
      const [loadedDepartments, loadedDoctors] = await Promise.all([
        getDepartments(undefined, signal),
        getDoctors(undefined, signal),
      ]);

      if (!signal?.aborted) {
        setDepartments(loadedDepartments);
        setDoctors(loadedDoctors);
      }
    } catch (error) {
      if (!signal?.aborted) {
        setFilterOptionsError(
          getUserFacingError(error, ADMIN_APPOINTMENTS_TEXT.errors.filterOptions),
        );
      }
    } finally {
      if (!signal?.aborted) {
        setIsFilterOptionsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void loadFilterOptions(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadFilterOptions]);

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
              getUserFacingError(error, ADMIN_APPOINTMENTS_TEXT.errors.patientOptions),
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
    }, normalizedSearch ? SEARCH_DEBOUNCE_MS : 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();

      if (patientLoadController.current === controller) {
        patientLoadController.current = null;
      }
    };
  }, [patientSearch, selectedPatient]);

  const query = useMemo<AppointmentQuery>(() => {
    const dateRange = getDateRange(filters.appointmentDate);

    return {
      search: filters.search.trim() || undefined,
      status: filters.status ?? undefined,
      doctorId: filters.doctorId ?? undefined,
      patientId: filters.patientId ?? undefined,
      departmentId: filters.departmentId ?? undefined,
      ...dateRange,
    };
  }, [filters]);

  const hasFilters = Boolean(
    filters.search.trim() ||
      filters.status ||
      filters.doctorId ||
      filters.patientId ||
      filters.departmentId ||
      filters.appointmentDate,
  );

  const updateFilter = <Key extends keyof FilterValues>(
    key: Key,
    value: FilterValues[Key],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const updatePatient = (patient: Patient | null) => {
    setSelectedPatient(patient);
    setPatientSearch(patient ? getPatientLabel(patient) : "");
    updateFilter("patientId", patient?.id ?? null);
  };

  const updatePatientSearch = (value: string) => {
    setPatientSearch(value);

    if (selectedPatient && value !== getPatientLabel(selectedPatient)) {
      setSelectedPatient(null);
      updateFilter("patientId", null);
    }
  };

  const clearFilters = () => {
    patientLoadController.current?.abort();
    patientLoadController.current = null;
    setFilters(emptyFilterValues);
    setSelectedPatient(null);
    setPatientSearch("");
    setPatientOptions([]);
    setPatientOptionsError(null);
  };

  return {
    appointmentDate: filters.appointmentDate,
    clearFilters,
    departmentId: filters.departmentId,
    departments,
    doctorId: filters.doctorId,
    doctors,
    filterOptionsError,
    hasFilters,
    isFilterOptionsLoading,
    isPatientOptionsLoading,
    patientOptions,
    patientOptionsError,
    patientSearch,
    query,
    retryLoadFilterOptions: () => void loadFilterOptions(),
    selectedPatient,
    setAppointmentDate: (value: string) => updateFilter("appointmentDate", value),
    setDepartmentId: (value: number | null) => updateFilter("departmentId", value),
    setDoctorId: (value: number | null) => updateFilter("doctorId", value),
    setPatient: updatePatient,
    setPatientSearch: updatePatientSearch,
    setSearch: (value: string) => updateFilter("search", value),
    setStatus: (value: AppointmentStatus | null) => updateFilter("status", value),
    status: filters.status,
    search: filters.search,
  };
}
