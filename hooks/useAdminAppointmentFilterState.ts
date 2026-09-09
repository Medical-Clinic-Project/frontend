"use client";

import { useCallback, useMemo, useState } from "react";
import type { AppointmentQuery, AppointmentStatus } from "@/types/appointment";
import { getDateRange } from "@/utils/appointments";

interface AdminAppointmentFilterValues {
  search: string;
  status: AppointmentStatus | null;
  doctorId: number | null;
  patientId: number | null;
  departmentId: number | null;
  appointmentDate: string;
}

const emptyFilterValues: AdminAppointmentFilterValues = {
  search: "",
  status: null,
  doctorId: null,
  patientId: null,
  departmentId: null,
  appointmentDate: "",
};

export function useAdminAppointmentFilterState() {
  const [filters, setFilters] = useState<AdminAppointmentFilterValues>(
    emptyFilterValues,
  );

  const updateFilter = useCallback(
    <Key extends keyof AdminAppointmentFilterValues>(
      key: Key,
      value: AdminAppointmentFilterValues[Key],
    ) => {
      setFilters((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const setSearch = useCallback(
    (value: string) => updateFilter("search", value),
    [updateFilter],
  );
  const setStatus = useCallback(
    (value: AppointmentStatus | null) => updateFilter("status", value),
    [updateFilter],
  );
  const setDoctorId = useCallback(
    (value: number | null) => updateFilter("doctorId", value),
    [updateFilter],
  );
  const setPatientId = useCallback(
    (value: number | null) => updateFilter("patientId", value),
    [updateFilter],
  );
  const setDepartmentId = useCallback(
    (value: number | null) => updateFilter("departmentId", value),
    [updateFilter],
  );
  const setAppointmentDate = useCallback(
    (value: string) => updateFilter("appointmentDate", value),
    [updateFilter],
  );
  const clearFilters = useCallback(() => {
    setFilters(emptyFilterValues);
  }, []);

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

  const hasFilters = useMemo(
    () =>
      Boolean(
        filters.search.trim() ||
          filters.status ||
          filters.doctorId ||
          filters.patientId ||
          filters.departmentId ||
          filters.appointmentDate,
      ),
    [filters],
  );

  return {
    appointmentDate: filters.appointmentDate,
    clearFilters,
    departmentId: filters.departmentId,
    doctorId: filters.doctorId,
    hasFilters,
    patientId: filters.patientId,
    query,
    search: filters.search,
    setAppointmentDate,
    setDepartmentId,
    setDoctorId,
    setPatientId,
    setSearch,
    setStatus,
    status: filters.status,
  };
}
