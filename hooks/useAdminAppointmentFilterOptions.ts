"use client";

import { useCallback, useEffect, useState } from "react";
import { getDepartments } from "@/api/departmentsApi";
import { getDoctors } from "@/api/doctorsApi";
import type { Department } from "@/types/department";
import type { Doctor } from "@/types/doctor";
import { getUserFacingError } from "@/utils/apiErrors";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

export function useAdminAppointmentFilterOptions() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isFilterOptionsLoading, setIsFilterOptionsLoading] = useState(true);
  const [filterOptionsError, setFilterOptionsError] = useState<string | null>(
    null,
  );

  const loadFilterOptions = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
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
            getUserFacingError(
              error,
              ADMIN_APPOINTMENTS_TEXT.errors.filterOptions,
            ),
          );
        }
      } finally {
        if (!signal?.aborted) {
          setIsFilterOptionsLoading(false);
        }
      }
    },
    [],
  );

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

  const retryLoadFilterOptions = useCallback(() => {
    void loadFilterOptions();
  }, [loadFilterOptions]);

  return {
    departments,
    doctors,
    filterOptionsError,
    isFilterOptionsLoading,
    retryLoadFilterOptions,
  };
}
