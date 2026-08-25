"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { patientsApi } from "@/api/patientsApi";
import type {
  Patient,
  PatientQuery,
  PatientStatusFilter,
} from "@/types/patient";
import { getUserFacingError } from "@/utils/apiErrors";
import { PATIENTS_TEXT } from "@/views/patients/Patients.text";

const SEARCH_DEBOUNCE_MS = 300;

function getPatientQuery(
  search: string,
  statusFilter: PatientStatusFilter,
): PatientQuery {
  return {
    search,
    ...(statusFilter === "all"
      ? {}
      : { isActive: statusFilter === "active" }),
  };
}

function getStatusFilter(query: PatientQuery): PatientStatusFilter {
  if (query.isActive === undefined) {
    return "all";
  }

  return query.isActive ? "active" : "inactive";
}

function replacePatient(
  patients: readonly Patient[],
  updatedPatient: Patient,
): Patient[] {
  return patients.map((patient) =>
    patient.id === updatedPatient.id ? updatedPatient : patient,
  );
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<PatientStatusFilter>("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [detailsPatient, setDetailsPatient] = useState<Patient | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [statusPatient, setStatusPatient] = useState<Patient | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const patientsLoadController = useRef<AbortController | null>(null);
  const detailsLoadController = useRef<AbortController | null>(null);
  const latestPatientQuery = useRef<PatientQuery>(getPatientQuery("", "all"));
  const isMounted = useRef(true);

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
        const loadedPatients = await patientsApi.getAll(query, signal);

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
    (query: PatientQuery, showLoading = true) => {
      patientsLoadController.current?.abort();
      const abortController = new AbortController();
      patientsLoadController.current = abortController;

      void loadPatients(query, showLoading, abortController.signal).finally(() => {
        if (patientsLoadController.current === abortController) {
          patientsLoadController.current = null;
        }
      });
    },
    [loadPatients],
  );

  const loadPatientDetails = useCallback(
    async (patientId: number, signal: AbortSignal): Promise<void> => {
      setIsDetailsLoading(true);
      setDetailsError(null);

      try {
        const patient = await patientsApi.getById(patientId, signal);

        if (!signal.aborted) {
          setDetailsPatient(patient);
        }
      } catch (error) {
        if (!signal.aborted) {
          setDetailsError(
            getUserFacingError(error, PATIENTS_TEXT.errors.details),
          );
        }
      } finally {
        if (!signal.aborted) {
          setIsDetailsLoading(false);
        }
      }
    },
    [],
  );

  const startDetailsLoad = useCallback(
    (patientId: number) => {
      detailsLoadController.current?.abort();
      const abortController = new AbortController();
      detailsLoadController.current = abortController;

      void loadPatientDetails(patientId, abortController.signal).finally(() => {
        if (detailsLoadController.current === abortController) {
          detailsLoadController.current = null;
        }
      });
    },
    [loadPatientDetails],
  );

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      patientsLoadController.current?.abort();
      detailsLoadController.current?.abort();
    };
  }, []);

  useEffect(() => {
    const query = getPatientQuery(search, statusFilter);
    const delay = search.trim() ? SEARCH_DEBOUNCE_MS : 0;
    const timeoutId = window.setTimeout(() => {
      startPatientsLoad(query);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      patientsLoadController.current?.abort();
      patientsLoadController.current = null;
    };
  }, [search, startPatientsLoad, statusFilter]);

  const retryLoadPatients = () => {
    startPatientsLoad(latestPatientQuery.current);
  };

  const updateSearch = (nextSearch: string) => {
    const currentQuery = latestPatientQuery.current;

    if (nextSearch === (currentQuery.search ?? "")) {
      return;
    }

    latestPatientQuery.current = getPatientQuery(
      nextSearch,
      getStatusFilter(currentQuery),
    );
    patientsLoadController.current?.abort();
    patientsLoadController.current = null;
    setSearch(nextSearch);
    setIsLoading(true);
    setLoadError(null);
  };

  const updateStatusFilter = (nextStatus: PatientStatusFilter) => {
    const currentQuery = latestPatientQuery.current;

    if (nextStatus === getStatusFilter(currentQuery)) {
      return;
    }

    latestPatientQuery.current = getPatientQuery(
      currentQuery.search ?? "",
      nextStatus,
    );
    patientsLoadController.current?.abort();
    patientsLoadController.current = null;
    setStatusFilter(nextStatus);
    setIsLoading(true);
    setLoadError(null);
  };

  const openDetailsDialog = (patient: Patient) => {
    setSuccessMessage(null);
    setDetailsPatient(patient);
    setDetailsError(null);
    setIsDetailsDialogOpen(true);
    startDetailsLoad(patient.id);
  };

  const closeDetailsDialog = () => {
    detailsLoadController.current?.abort();
    detailsLoadController.current = null;
    setIsDetailsDialogOpen(false);
    setIsDetailsLoading(false);
    setDetailsError(null);
    setDetailsPatient(null);
  };

  const retryLoadPatientDetails = () => {
    if (detailsPatient) {
      startDetailsLoad(detailsPatient.id);
    }
  };

  const openStatusDialog = (patient: Patient) => {
    setSuccessMessage(null);
    setStatusPatient(patient);
    setStatusError(null);
    setIsStatusDialogOpen(true);
  };

  const closeStatusDialog = () => {
    if (isStatusUpdating) {
      return;
    }

    setIsStatusDialogOpen(false);
    setStatusError(null);
    setStatusPatient(null);
  };

  const confirmStatusChange = async (): Promise<void> => {
    if (!statusPatient || isStatusUpdating) {
      return;
    }

    const patientToUpdate = statusPatient;
    setIsStatusUpdating(true);
    setStatusError(null);

    try {
      const updatedPatient = await patientsApi.updateStatus(patientToUpdate.id, {
        isActive: !patientToUpdate.isActive,
      });

      if (!isMounted.current) {
        return;
      }

      const currentStatusFilter = getStatusFilter(latestPatientQuery.current);
      setPatients((currentPatients) => {
        if (
          currentStatusFilter !== "all" &&
          updatedPatient.isActive !== (currentStatusFilter === "active")
        ) {
          return currentPatients.filter(
            (patient) => patient.id !== updatedPatient.id,
          );
        }

        return replacePatient(currentPatients, updatedPatient);
      });
      setDetailsPatient((currentPatient) =>
        currentPatient?.id === updatedPatient.id
          ? updatedPatient
          : currentPatient,
      );
      setSuccessMessage(
        updatedPatient.isActive
          ? PATIENTS_TEXT.feedback.activated(updatedPatient.fullName)
          : PATIENTS_TEXT.feedback.deactivated(updatedPatient.fullName),
      );
      setIsStatusDialogOpen(false);
      setStatusPatient(null);
    } catch (error) {
      if (isMounted.current) {
        setStatusError(getUserFacingError(error, PATIENTS_TEXT.errors.status));
      }
    } finally {
      if (isMounted.current) {
        setIsStatusUpdating(false);
      }
    }
  };

  return {
    patients,
    isLoading,
    loadError,
    search,
    setSearch: updateSearch,
    statusFilter,
    setStatusFilter: updateStatusFilter,
    retryLoadPatients,
    successMessage,
    clearSuccessMessage: () => setSuccessMessage(null),
    detailsPatient,
    isDetailsDialogOpen,
    isDetailsLoading,
    detailsError,
    openDetailsDialog,
    closeDetailsDialog,
    retryLoadPatientDetails,
    statusPatient,
    isStatusDialogOpen,
    isStatusUpdating,
    statusError,
    openStatusDialog,
    closeStatusDialog,
    confirmStatusChange,
  };
}
