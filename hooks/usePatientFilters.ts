"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPatients } from "@/api/patientsApi";
import {
  PATIENT_SEARCH_DEBOUNCE_MS,
  PATIENT_STATUS_FILTERS,
} from "@/constants/patients";
import type {
  Patient,
  PatientQuery,
  PatientStatusFilter,
} from "@/types/patient";
import { getUserFacingError } from "@/utils/apiErrors";
import { PATIENTS_TEXT } from "@/views/patients/PatientsText";

function createPatientQuery(
  search: string,
  statusFilter: PatientStatusFilter,
): PatientQuery {
  return {
    search,
    ...(statusFilter === PATIENT_STATUS_FILTERS.all
      ? {}
      : { isActive: statusFilter === PATIENT_STATUS_FILTERS.active }),
  };
}

export function usePatientFilters() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatusFilter>(
    PATIENT_STATUS_FILTERS.all,
  );
  const patientsLoadController = useRef<AbortController | null>(null);
  const latestPatientQuery = useRef<PatientQuery>(
    createPatientQuery("", PATIENT_STATUS_FILTERS.all),
  );

  const loadPatients = useCallback(
    async (
      query: PatientQuery,
      showLoading: boolean,
      signal: AbortSignal,
    ): Promise<void> => {
      if (showLoading) {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        const loadedPatients = await getPatients(query, signal);

        if (!signal.aborted) {
          setPatients(loadedPatients);
        }
      } catch (error) {
        if (!signal.aborted) {
          setLoadError(getUserFacingError(error, PATIENTS_TEXT.errors.load));
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const startPatientsLoad = useCallback(
    async (query: PatientQuery, showLoading = true): Promise<void> => {
      patientsLoadController.current?.abort();
      const abortController = new AbortController();
      patientsLoadController.current = abortController;

      await loadPatients(query, showLoading, abortController.signal).finally(() => {
        if (patientsLoadController.current === abortController) {
          patientsLoadController.current = null;
        }
      });
    },
    [loadPatients],
  );

  useEffect(() => {
    const query = createPatientQuery(search, statusFilter);
    latestPatientQuery.current = query;
    const delay = search.trim() ? PATIENT_SEARCH_DEBOUNCE_MS : 0;
    const timeoutId = window.setTimeout(() => {
      void startPatientsLoad(query);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      patientsLoadController.current?.abort();
      patientsLoadController.current = null;
    };
  }, [search, startPatientsLoad, statusFilter]);

  const retryLoadPatients = useCallback(() => {
    void startPatientsLoad(latestPatientQuery.current);
  }, [startPatientsLoad]);

  const updateSearch = useCallback(
    (nextSearch: string) => {
      if (nextSearch === search) {
        return;
      }

      latestPatientQuery.current = createPatientQuery(nextSearch, statusFilter);
      patientsLoadController.current?.abort();
      patientsLoadController.current = null;
      setSearch(nextSearch);
      setIsLoading(true);
      setLoadError(null);
    },
    [search, statusFilter],
  );

  const updateStatusFilter = useCallback(
    (nextStatus: PatientStatusFilter) => {
      if (nextStatus === statusFilter) {
        return;
      }

      latestPatientQuery.current = createPatientQuery(search, nextStatus);
      patientsLoadController.current?.abort();
      patientsLoadController.current = null;
      setStatusFilter(nextStatus);
      setIsLoading(true);
      setLoadError(null);
    },
    [search, statusFilter],
  );

  const refreshPatients = useCallback(
    () => startPatientsLoad(latestPatientQuery.current, false),
    [startPatientsLoad],
  );

  return {
    patients,
    isLoading,
    loadError,
    search,
    setSearch: updateSearch,
    statusFilter,
    setStatusFilter: updateStatusFilter,
    retryLoadPatients,
    refreshPatients,
  };
}
