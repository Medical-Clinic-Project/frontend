"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDepartments } from "@/api/departmentsApi";
import {
  createDoctor,
  getDoctors,
  updateDoctor,
} from "@/api/doctorsApi";
import { useToast } from "@/hooks/useToast";
import type { ApiFieldErrors } from "@/types/api";
import { ApiError } from "@/types/api";
import type { Department } from "@/types/department";
import type {
  CreateDoctorRequest,
  Doctor,
  DoctorQuery,
  UpdateDoctorRequest,
} from "@/types/doctor";
import { getUserFacingError } from "@/utils/apiErrors";
import type { DoctorFormValues } from "@/utils/validation/doctorValidation";
import { DOCTORS_TEXT } from "@/views/doctors/DoctorsText";

const SEARCH_DEBOUNCE_MS = 300;

function getDoctorQuery(
  search: string,
  departmentFilter: number | null,
): DoctorQuery {
  return {
    search,
    ...(departmentFilter === null
      ? {}
      : { departmentId: departmentFilter }),
  };
}

function mergeDoctor(doctors: Doctor[], updatedDoctor: Doctor): Doctor[] {
  const doctorExists = doctors.some((doctor) => doctor.id === updatedDoctor.id);

  if (!doctorExists) {
    return [...doctors, updatedDoctor];
  }

  return doctors.map((doctor) =>
    doctor.id === updatedDoctor.id ? updatedDoctor : doctor,
  );
}

export function useDoctors() {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formFieldErrors, setFormFieldErrors] = useState<ApiFieldErrors>({});
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const doctorsLoadController = useRef<AbortController | null>(null);
  const departmentsLoadController = useRef<AbortController | null>(null);
  const isMounted = useRef(true);
  const latestDoctorQuery = useRef<DoctorQuery>(getDoctorQuery("", null));

  const activeDepartments = useMemo(
    () => departments.filter((department) => department.isActive),
    [departments],
  );

  const loadDoctors = useCallback(
    async (
      query: DoctorQuery,
      showLoading: boolean,
      signal: AbortSignal,
    ): Promise<void> => {
      if (showLoading) {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        const loadedDoctors = await getDoctors(query, signal);

        if (!signal.aborted) {
          setDoctors(loadedDoctors);
        }
      } catch (error) {
        if (!signal.aborted) {
          setLoadError(getUserFacingError(error, DOCTORS_TEXT.errors.load));
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const startDoctorsLoad = useCallback(
    (query: DoctorQuery, showLoading = true) => {
      doctorsLoadController.current?.abort();
      const abortController = new AbortController();
      doctorsLoadController.current = abortController;

      void loadDoctors(query, showLoading, abortController.signal).finally(() => {
        if (doctorsLoadController.current === abortController) {
          doctorsLoadController.current = null;
        }
      });
    },
    [loadDoctors],
  );

  const loadDepartments = useCallback(async (signal: AbortSignal) => {
    setDepartmentsLoading(true);
    setDepartmentsError(null);

    try {
      const loadedDepartments = await getDepartments(undefined, signal);

      if (!signal.aborted) {
        setDepartments(loadedDepartments);
      }
    } catch (error) {
      if (!signal.aborted) {
        setDepartmentsError(
          getUserFacingError(error, DOCTORS_TEXT.errors.departmentsLoad),
        );
      }
    } finally {
      if (!signal.aborted) {
        setDepartmentsLoading(false);
      }
    }
  }, []);

  const startDepartmentsLoad = useCallback(() => {
    departmentsLoadController.current?.abort();
    const abortController = new AbortController();
    departmentsLoadController.current = abortController;

    void loadDepartments(abortController.signal).finally(() => {
      if (departmentsLoadController.current === abortController) {
        departmentsLoadController.current = null;
      }
    });
  }, [loadDepartments]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const delay = search.trim() ? SEARCH_DEBOUNCE_MS : 0;
    const query = getDoctorQuery(search, departmentFilter);
    const timeoutId = window.setTimeout(() => {
      startDoctorsLoad(query);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      doctorsLoadController.current?.abort();
      doctorsLoadController.current = null;
    };
  }, [departmentFilter, search, startDoctorsLoad]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startDepartmentsLoad();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      departmentsLoadController.current?.abort();
      departmentsLoadController.current = null;
    };
  }, [startDepartmentsLoad]);

  const retryLoadDoctors = () => {
    startDoctorsLoad(latestDoctorQuery.current);
  };

  const updateSearch = (nextSearch: string) => {
    const currentSearch = latestDoctorQuery.current.search ?? "";

    if (nextSearch === currentSearch) {
      return;
    }

    latestDoctorQuery.current = getDoctorQuery(
      nextSearch,
      latestDoctorQuery.current.departmentId ?? null,
    );
    doctorsLoadController.current?.abort();
    doctorsLoadController.current = null;
    setSearch(nextSearch);
    setIsLoading(true);
    setLoadError(null);
  };

  const updateDepartmentFilter = (nextDepartmentId: number | null) => {
    const currentDepartmentId = latestDoctorQuery.current.departmentId ?? null;

    if (nextDepartmentId === currentDepartmentId) {
      return;
    }

    latestDoctorQuery.current = getDoctorQuery(
      latestDoctorQuery.current.search ?? "",
      nextDepartmentId,
    );
    doctorsLoadController.current?.abort();
    doctorsLoadController.current = null;
    setDepartmentFilter(nextDepartmentId);
    setIsLoading(true);
    setLoadError(null);
  };

  const openCreateDialog = () => {
    if (
      departmentsLoading ||
      departmentsError ||
      activeDepartments.length === 0
    ) {
      return;
    }

    setFormFieldErrors({});
    setSelectedDoctor(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (doctor: Doctor) => {
    setFormFieldErrors({});
    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setFormFieldErrors({});
    setSelectedDoctor(null);
    setIsDialogOpen(false);
  };

  const handleSaveError = (error: unknown): false => {
    if (error instanceof ApiError && Object.keys(error.fieldErrors).length > 0) {
      setFormFieldErrors(error.fieldErrors);
      showToast(error.message, "error");
      return false;
    }

    if (error instanceof ApiError && error.status === 409) {
      setFormFieldErrors({ email: [error.message] });
      showToast(error.message, "error");
      return false;
    }

    showToast(getUserFacingError(error, DOCTORS_TEXT.errors.save), "error");
    return false;
  };

  const saveDoctor = async (values: DoctorFormValues): Promise<boolean> => {
    setFormFieldErrors({});

    if (selectedDoctor && values.mode !== "edit") {
      showToast(DOCTORS_TEXT.errors.save, "error");
      return false;
    }

    if (!selectedDoctor && values.mode !== "create") {
      showToast(DOCTORS_TEXT.errors.save, "error");
      return false;
    }

    const department = departments.find(
      (item) => item.id === values.departmentId,
    );

    if (!department?.isActive) {
      setFormFieldErrors({
        departmentId: [DOCTORS_TEXT.errors.departmentUnavailable],
      });
      return false;
    }

    const fullName = values.fullName.trim();
    const email = values.email.trim().toLowerCase();

    try {
      if (selectedDoctor && values.mode === "edit") {
        const request: UpdateDoctorRequest = {
          fullName,
          email,
          departmentId: department.id,
          isActive: selectedDoctor.isActive,
        };
        const updatedDoctor = await updateDoctor(selectedDoctor.id, request);

        if (!isMounted.current) {
          return true;
        }

        setDoctors((currentDoctors) =>
          mergeDoctor(currentDoctors, updatedDoctor),
        );
        showToast(DOCTORS_TEXT.feedback.updated(updatedDoctor.fullName));
        closeDialog();
        startDoctorsLoad(latestDoctorQuery.current);
        return true;
      }

      if (values.mode !== "create") {
        showToast(DOCTORS_TEXT.errors.save, "error");
        return false;
      }

      const request: CreateDoctorRequest = {
        fullName,
        email,
        password: values.password,
        departmentId: department.id,
      };
      const createdDoctor = await createDoctor(request);

      if (!isMounted.current) {
        return true;
      }

      setDoctors((currentDoctors) => mergeDoctor(currentDoctors, createdDoctor));
      showToast(DOCTORS_TEXT.feedback.created(createdDoctor.fullName));
      closeDialog();

      latestDoctorQuery.current = getDoctorQuery("", null);
      doctorsLoadController.current?.abort();
      doctorsLoadController.current = null;
      setSearch("");
      setDepartmentFilter(null);
      startDoctorsLoad(latestDoctorQuery.current);

      return true;
    } catch (error) {
      return isMounted.current ? handleSaveError(error) : false;
    }
  };

  const toggleDoctorStatus = async (doctor: Doctor): Promise<void> => {
    setStatusUpdatingId(doctor.id);

    try {
      const request: UpdateDoctorRequest = {
        fullName: doctor.fullName,
        email: doctor.email,
        departmentId: doctor.departmentId,
        isActive: !doctor.isActive,
      };
      const updatedDoctor = await updateDoctor(doctor.id, request);

      if (!isMounted.current) {
        return;
      }

      setDoctors((currentDoctors) =>
        currentDoctors.map((currentDoctor) =>
          currentDoctor.id === updatedDoctor.id ? updatedDoctor : currentDoctor,
        ),
      );
      showToast(
        updatedDoctor.isActive
          ? DOCTORS_TEXT.feedback.activated(updatedDoctor.fullName)
          : DOCTORS_TEXT.feedback.deactivated(updatedDoctor.fullName),
      );
    } catch (error) {
      if (isMounted.current) {
        showToast(getUserFacingError(error, DOCTORS_TEXT.errors.status), "error");
      }
    } finally {
      if (isMounted.current) {
        setStatusUpdatingId(null);
      }
    }
  };

  return {
    activeDepartments,
    canCreateDoctor:
      !departmentsLoading &&
      !departmentsError &&
      activeDepartments.length > 0,
    closeDialog,
    departmentFilter,
    departments,
    departmentsError,
    departmentsLoading,
    doctors,
    formFieldErrors,
    isDialogOpen,
    isLoading,
    loadError,
    openCreateDialog,
    openEditDialog,
    retryLoadDepartments: startDepartmentsLoad,
    retryLoadDoctors,
    saveDoctor,
    search,
    selectedDoctor,
    setDepartmentFilter: updateDepartmentFilter,
    setSearch: updateSearch,
    statusUpdatingId,
    toggleDoctorStatus,
  };
}
