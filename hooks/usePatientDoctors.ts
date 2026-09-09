"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getPatientDoctors } from "@/api/patientDoctorsApi";
import { PATIENT_DOCTOR_SEARCH_DEBOUNCE_MS } from "@/constants/patientDoctors";
import type { PatientDoctor } from "@/types/patientDoctor";
import { getUserFacingError } from "@/utils/apiErrors";
import { PATIENT_DOCTORS_TEXT } from "@/views/patientDoctors/PatientDoctorsText";

interface PatientDoctorDepartment {
  id: number;
  name: string;
}

export function usePatientDoctors() {
  const [doctors, setDoctors] = useState<PatientDoctor[]>([]);
  const [discoveredDepartments, setDiscoveredDepartments] = useState<
    PatientDoctorDepartment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<number | null>(null);

  const loadDoctors = useCallback(
    async (
      query: { search?: string; departmentId?: number | null },
      signal?: AbortSignal,
    ): Promise<void> => {
      setLoadError(null);

      try {
        const loadedDoctors = await getPatientDoctors(
          {
            search: query.search,
            departmentId: query.departmentId ?? undefined,
          },
          signal,
        );

        if (signal?.aborted) {
          return;
        }

        setDoctors(loadedDoctors);
        setDiscoveredDepartments((current) => {
          const departmentsById = new Map(
            current.map((department) => [department.id, department]),
          );

          for (const doctor of loadedDoctors) {
            departmentsById.set(doctor.departmentId, {
              id: doctor.departmentId,
              name: doctor.departmentName,
            });
          }

          return [...departmentsById.values()].sort((left, right) =>
            left.name.localeCompare(right.name),
          );
        });
      } catch (error) {
        if (!signal?.aborted) {
          setLoadError(getUserFacingError(error, PATIENT_DOCTORS_TEXT.errors.load));
        }
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    const delay = search.trim() ? PATIENT_DOCTOR_SEARCH_DEBOUNCE_MS : 0;

    const timeoutId = window.setTimeout(() => {
      void loadDoctors(
        { search, departmentId: departmentFilter },
        controller.signal,
      );
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [departmentFilter, loadDoctors, search]);

  const retryLoadDoctors = () => {
    setIsLoading(true);
    setLoadError(null);
    void loadDoctors({ search, departmentId: departmentFilter });
  };

  const updateSearch = (nextSearch: string) => {
    setIsLoading(true);
    setLoadError(null);
    setSearch(nextSearch);
  };

  const updateDepartmentFilter = (departmentId: number | null) => {
    setIsLoading(true);
    setLoadError(null);
    setDepartmentFilter(departmentId);
  };

  const departments = useMemo(
    () => discoveredDepartments,
    [discoveredDepartments],
  );

  return {
    departmentFilter,
    departments,
    doctors,
    isLoading,
    loadError,
    retryLoadDoctors,
    search,
    setDepartmentFilter: updateDepartmentFilter,
    setSearch: updateSearch,
  };
}
