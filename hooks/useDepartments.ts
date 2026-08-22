"use client";

import { useCallback, useEffect, useState } from "react";
import { departmentsApi } from "@/api/departmentsApi";
import type { ApiFieldErrors } from "@/types/api";
import { ApiError } from "@/types/api";
import type { Department } from "@/types/department";
import { getUserFacingError } from "@/utils/apiErrors";
import type { DepartmentFormValues } from "@/utils/validation/departmentValidation";
import { DEPARTMENTS_TEXT } from "@/views/departments/Departments.text";

const SEARCH_DEBOUNCE_MS = 300;

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formFieldErrors, setFormFieldErrors] = useState<ApiFieldErrors>({});
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);

  const loadDepartments = useCallback(
    async (
      searchTerm: string,
      showLoading = true,
      signal?: AbortSignal,
    ): Promise<boolean> => {
      if (showLoading) {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        const loadedDepartments = await departmentsApi.getAll(searchTerm, signal);

        if (signal?.aborted) {
          return false;
        }

        setDepartments(loadedDepartments);
        return true;
      } catch (error) {
        if (signal?.aborted) {
          return false;
        }

        setLoadError(getUserFacingError(error, DEPARTMENTS_TEXT.errors.load));
        return false;
      } finally {
        if (showLoading && !signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const abortController = new AbortController();
    const delay = search.trim() ? SEARCH_DEBOUNCE_MS : 0;

    const timeoutId = window.setTimeout(() => {
      void loadDepartments(search, true, abortController.signal);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [loadDepartments, search]);

  const retryLoadDepartments = () => {
    void loadDepartments(search);
  };

  const updateSearch = (nextSearch: string) => {
    setSearch(nextSearch);
    setIsLoading(true);
    setLoadError(null);
  };

  const clearFeedback = () => {
    setOperationError(null);
    setSuccessMessage(null);
  };

  const openCreateDialog = () => {
    clearFeedback();
    setFormFieldErrors({});
    setSelectedDepartment(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (department: Department) => {
    clearFeedback();
    setFormFieldErrors({});
    setSelectedDepartment(department);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setFormFieldErrors({});
    setOperationError(null);
    setIsDialogOpen(false);
    setSelectedDepartment(null);
  };

  const saveDepartment = async (values: DepartmentFormValues): Promise<boolean> => {
    clearFeedback();
    setFormFieldErrors({});

    const request = {
      name: values.name.trim(),
      description: values.description.trim(),
      isActive: values.isActive,
    };

    try {
      if (selectedDepartment) {
        const updatedDepartment = await departmentsApi.update(
          selectedDepartment.id,
          request,
        );

        await loadDepartments(search, false);
        setSuccessMessage(DEPARTMENTS_TEXT.feedback.updated(updatedDepartment.name));
      } else {
        const createdDepartment = await departmentsApi.create(request);

        await loadDepartments(search, false);
        setSuccessMessage(DEPARTMENTS_TEXT.feedback.created(createdDepartment.name));
      }

      closeDialog();
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400 && Object.keys(error.fieldErrors).length) {
          setFormFieldErrors(error.fieldErrors);
          return false;
        }

        if (error.status === 409) {
          setFormFieldErrors({ name: [error.message] });
          return false;
        }
      }

      setOperationError(getUserFacingError(error, DEPARTMENTS_TEXT.errors.save));
      return false;
    }
  };

  const toggleDepartmentStatus = async (department: Department): Promise<void> => {
    clearFeedback();
    setStatusUpdatingId(department.id);
    const nextIsActive = !department.isActive;

    try {
      const updatedDepartment = await departmentsApi.updateStatus(department.id, {
        isActive: nextIsActive,
      });

      await loadDepartments(search, false);
      setSuccessMessage(
        updatedDepartment.isActive
          ? DEPARTMENTS_TEXT.feedback.activated(updatedDepartment.name)
          : DEPARTMENTS_TEXT.feedback.deactivated(updatedDepartment.name),
      );
    } catch (error) {
      setOperationError(getUserFacingError(error, DEPARTMENTS_TEXT.errors.status));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return {
    departments,
    formFieldErrors,
    isDialogOpen,
    isLoading,
    retryLoadDepartments,
    loadError,
    operationError,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    saveDepartment,
    search,
    selectedDepartment,
    setSearch: updateSearch,
    statusUpdatingId,
    successMessage,
    clearSuccessMessage: () => setSuccessMessage(null),
    toggleDepartmentStatus,
  };
}
