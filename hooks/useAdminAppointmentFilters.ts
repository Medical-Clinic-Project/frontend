"use client";

import { useCallback } from "react";
import { useAdminAppointmentFilterOptions } from "@/hooks/useAdminAppointmentFilterOptions";
import { useAdminAppointmentFilterState } from "@/hooks/useAdminAppointmentFilterState";
import { useAdminAppointmentPatientSearch } from "@/hooks/useAdminAppointmentPatientSearch";

export function useAdminAppointmentFilters() {
  const filterState = useAdminAppointmentFilterState();
  const filterOptions = useAdminAppointmentFilterOptions();
  const patientSearch = useAdminAppointmentPatientSearch({
    onPatientIdChange: filterState.setPatientId,
  });
  const clearFilterState = filterState.clearFilters;
  const clearPatientSearch = patientSearch.clearPatientSearch;

  const clearFilters = useCallback(() => {
    clearFilterState();
    clearPatientSearch();
  }, [clearFilterState, clearPatientSearch]);

  return {
    filters: {
      search: filterState.search,
      status: filterState.status,
      doctorId: filterState.doctorId,
      departmentId: filterState.departmentId,
      appointmentDate: filterState.appointmentDate,
      selectedPatient: patientSearch.selectedPatient,
      patientSearch: patientSearch.patientSearch,
      hasFilters: filterState.hasFilters,
    },
    options: {
      departments: filterOptions.departments,
      doctors: filterOptions.doctors,
      patientOptions: patientSearch.patientOptions,
      isFilterOptionsLoading: filterOptions.isFilterOptionsLoading,
      isPatientOptionsLoading: patientSearch.isPatientOptionsLoading,
    },
    actions: {
      setSearch: filterState.setSearch,
      setStatus: filterState.setStatus,
      setDoctorId: filterState.setDoctorId,
      setDepartmentId: filterState.setDepartmentId,
      setAppointmentDate: filterState.setAppointmentDate,
      setPatient: patientSearch.setPatient,
      setPatientSearch: patientSearch.setPatientSearch,
      clearFilters,
    },
    query: filterState.query,
    filterOptionsError: filterOptions.filterOptionsError,
    patientOptionsError: patientSearch.patientOptionsError,
    retryLoadFilterOptions: filterOptions.retryLoadFilterOptions,
  };
}
