"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createDoctorAvailability,
  deleteDoctorAvailability,
  getMyDoctorAvailability,
  updateDoctorAvailability,
} from "@/api/doctorAvailabilityApi";
import type { ApiFieldErrors } from "@/types/api";
import { ApiError } from "@/types/api";
import type {
  DoctorAvailability,
  DoctorAvailabilityRange,
  DoctorAvailabilityRequest,
} from "@/types/doctorAvailability";
import type { DoctorAvailabilityFormValues } from "@/utils/validation/doctorAvailabilityValidation";
import { getUserFacingError } from "@/utils/apiErrors";
import {
  addMinutes,
  getAvailabilityRange,
  getDurationMinutes,
  intersectsRange,
  isSameInstant,
  navigateDate,
  parseLocalDateTimeInput,
  startOfLocalDay,
  type AvailabilityViewMode,
} from "@/views/doctorAvailability/doctorAvailabilityDates";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityView.text";

const AVAILABILITY_FORM_FIELDS = ["startTime", "endTime"] as const;

function sortAvailability(
  availability: readonly DoctorAvailability[],
): DoctorAvailability[] {
  return [...availability].sort((left, right) => {
    const timeDifference =
      new Date(left.startTime).getTime() -
      new Date(right.startTime).getTime();

    return timeDifference || left.id - right.id;
  });
}

function mergeAvailability(
  availability: readonly DoctorAvailability[],
  updated: DoctorAvailability,
  range: DoctorAvailabilityRange,
): DoctorAvailability[] {
  const withoutUpdated = availability.filter(
    (slot) => slot.id !== updated.id,
  );

  return intersectsRange(updated, range)
    ? sortAvailability([...withoutUpdated, updated])
    : sortAvailability(withoutUpdated);
}

function toRequest(
  values: DoctorAvailabilityFormValues,
): DoctorAvailabilityRequest | null {
  const start = parseLocalDateTimeInput(values.startTime);
  const end = parseLocalDateTimeInput(values.endTime);

  if (!start || !end) {
    return null;
  }

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

export function useDoctorAvailability() {
  const [viewMode, setViewMode] =
    useState<AvailabilityViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(() =>
    startOfLocalDay(new Date()),
  );
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] =
    useState<DoctorAvailability | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formFieldErrors, setFormFieldErrors] =
    useState<ApiFieldErrors>({});

  const [deleteAvailability, setDeleteAvailability] =
    useState<DoctorAvailability | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [movingAvailabilityId, setMovingAvailabilityId] =
    useState<number | null>(null);

  const loadController = useRef<AbortController | null>(null);
  const isMounted = useRef(true);
  const visibleRange = useMemo(
    () => getAvailabilityRange(selectedDate, viewMode),
    [selectedDate, viewMode],
  );

  const loadAvailability = useCallback(
    async (
      range: DoctorAvailabilityRange,
      showLoading: boolean,
      signal: AbortSignal,
    ): Promise<void> => {
      if (showLoading) {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        const loadedAvailability =
          await getMyDoctorAvailability(range, signal);

        if (!signal.aborted) {
          setAvailability(sortAvailability(loadedAvailability));
        }
      } catch (error) {
        if (!signal.aborted) {
          setLoadError(
            getUserFacingError(
              error,
              DOCTOR_AVAILABILITY_TEXT.errors.load,
            ),
          );
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const startAvailabilityLoad = useCallback(
    (showLoading = true) => {
      loadController.current?.abort();
      const controller = new AbortController();
      loadController.current = controller;

      void loadAvailability(
        visibleRange,
        showLoading,
        controller.signal,
      ).finally(() => {
        if (loadController.current === controller) {
          loadController.current = null;
        }
      });
    },
    [loadAvailability, visibleRange],
  );

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startAvailabilityLoad();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      loadController.current?.abort();
      loadController.current = null;
    };
  }, [startAvailabilityLoad]);

  const clearFeedback = () => {
    setOperationError(null);
    setSuccessMessage(null);
  };

  const openCreateDialog = () => {
    clearFeedback();
    setFormError(null);
    setFormFieldErrors({});
    setSelectedAvailability(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (slot: DoctorAvailability) => {
    clearFeedback();
    setFormError(null);
    setFormFieldErrors({});
    setSelectedAvailability(slot);
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setFormError(null);
    setFormFieldErrors({});
    setSelectedAvailability(null);
  };

  const handleSaveError = (error: unknown): false => {
    if (
      error instanceof ApiError &&
      error.status === 400 &&
      Object.keys(error.fieldErrors).length > 0
    ) {
      const supportedErrors = Object.fromEntries(
        Object.entries(error.fieldErrors).filter(([field]) =>
          AVAILABILITY_FORM_FIELDS.includes(
            field as (typeof AVAILABILITY_FORM_FIELDS)[number],
          ),
        ),
      );

      if (Object.keys(supportedErrors).length > 0) {
        setFormFieldErrors(supportedErrors);
        return false;
      }
    }

    setFormError(
      getUserFacingError(error, DOCTOR_AVAILABILITY_TEXT.errors.save),
    );
    return false;
  };

  const saveAvailability = async (
    values: DoctorAvailabilityFormValues,
  ): Promise<boolean> => {
    setFormError(null);
    setFormFieldErrors({});
    const request = toRequest(values);

    if (!request) {
      setFormError(DOCTOR_AVAILABILITY_TEXT.errors.save);
      return false;
    }

    try {
      const savedAvailability = selectedAvailability
        ? await updateDoctorAvailability(
            selectedAvailability.id,
            request,
          )
        : await createDoctorAvailability(request);

      if (!isMounted.current) {
        return true;
      }

      setAvailability((current) =>
        mergeAvailability(current, savedAvailability, visibleRange),
      );
      setSelectedDate(
        startOfLocalDay(new Date(savedAvailability.startTime)),
      );
      setSuccessMessage(
        selectedAvailability
          ? DOCTOR_AVAILABILITY_TEXT.feedback.updated
          : DOCTOR_AVAILABILITY_TEXT.feedback.created,
      );
      closeFormDialog();
      startAvailabilityLoad(false);
      return true;
    } catch (error) {
      if (!isMounted.current) {
        return false;
      }

      return handleSaveError(error);
    }
  };

  const requestDelete = () => {
    if (!selectedAvailability) {
      return;
    }

    setDeleteAvailability(selectedAvailability);
    setDeleteError(null);
    setIsDeleteOpen(true);
    setIsFormOpen(false);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteOpen(false);
    setDeleteAvailability(null);
    setDeleteError(null);
    setSelectedAvailability(null);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deleteAvailability) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteDoctorAvailability(deleteAvailability.id);

      if (!isMounted.current) {
        return;
      }

      setAvailability((current) =>
        current.filter((slot) => slot.id !== deleteAvailability.id),
      );
      setSuccessMessage(DOCTOR_AVAILABILITY_TEXT.feedback.deleted);
      setIsDeleteOpen(false);
      setDeleteAvailability(null);
      setSelectedAvailability(null);
    } catch (error) {
      if (isMounted.current) {
        setDeleteError(
          getUserFacingError(
            error,
            DOCTOR_AVAILABILITY_TEXT.errors.delete,
          ),
        );
      }
    } finally {
      if (isMounted.current) {
        setIsDeleting(false);
      }
    }
  };

  const moveAvailability = async (
    slot: DoctorAvailability,
    newStart: Date,
  ): Promise<void> => {
    const previousStart = new Date(slot.startTime);

    if (isSameInstant(previousStart, newStart)) {
      return;
    }

    clearFeedback();

    if (newStart < new Date()) {
      setOperationError(DOCTOR_AVAILABILITY_TEXT.errors.movePast);
      return;
    }

    const newEnd = addMinutes(newStart, getDurationMinutes(slot));
    const optimisticAvailability: DoctorAvailability = {
      ...slot,
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
    };

    setMovingAvailabilityId(slot.id);
    setAvailability((current) =>
      mergeAvailability(current, optimisticAvailability, visibleRange),
    );

    try {
      const updatedAvailability = await updateDoctorAvailability(
        slot.id,
        {
          startTime: optimisticAvailability.startTime,
          endTime: optimisticAvailability.endTime,
        },
      );

      if (!isMounted.current) {
        return;
      }

      setAvailability((current) =>
        mergeAvailability(current, updatedAvailability, visibleRange),
      );
      setSuccessMessage(DOCTOR_AVAILABILITY_TEXT.feedback.moved);
    } catch (error) {
      if (!isMounted.current) {
        return;
      }

      setAvailability((current) =>
        mergeAvailability(current, slot, visibleRange),
      );
      setOperationError(
        getUserFacingError(error, DOCTOR_AVAILABILITY_TEXT.errors.move),
      );
      startAvailabilityLoad(false);
    } finally {
      if (isMounted.current) {
        setMovingAvailabilityId(null);
      }
    }
  };

  const changeViewMode = (mode: AvailabilityViewMode) => {
    if (mode !== viewMode) {
      clearFeedback();
      setViewMode(mode);
    }
  };

  const goToToday = () => {
    clearFeedback();
    setSelectedDate(startOfLocalDay(new Date()));
  };

  const goToPrevious = () => {
    clearFeedback();
    setSelectedDate((current) => navigateDate(current, viewMode, -1));
  };

  const goToNext = () => {
    clearFeedback();
    setSelectedDate((current) => navigateDate(current, viewMode, 1));
  };

  return {
    availability,
    changeViewMode,
    clearOperationError: () => setOperationError(null),
    clearSuccessMessage: () => setSuccessMessage(null),
    closeDeleteDialog,
    closeFormDialog,
    confirmDelete,
    deleteAvailability,
    deleteError,
    formError,
    formFieldErrors,
    goToNext,
    goToPrevious,
    goToToday,
    isDeleteOpen,
    isDeleting,
    isFormOpen,
    isLoading,
    loadError,
    moveAvailability,
    movingAvailabilityId,
    openCreateDialog,
    openEditDialog,
    operationError,
    requestDelete,
    retryLoad: startAvailabilityLoad,
    saveAvailability,
    selectedAvailability,
    selectedDate,
    successMessage,
    viewMode,
  };
}
