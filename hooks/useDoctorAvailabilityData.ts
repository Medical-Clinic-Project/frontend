"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMyDoctorAvailability } from "@/api/doctorAvailabilityApi";
import type {
  DoctorAvailability,
  DoctorAvailabilityRange,
} from "@/types/doctorAvailability";
import { getUserFacingError } from "@/utils/apiErrors";
import {
  mergeDoctorAvailability,
  sortDoctorAvailability,
} from "@/utils/doctorAvailability/availability";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityText";

interface UseDoctorAvailabilityDataOptions {
  visibleRange: DoctorAvailabilityRange;
}

export function useDoctorAvailabilityData({
  visibleRange,
}: UseDoctorAvailabilityDataOptions) {
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadController = useRef<AbortController | null>(null);

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
          setAvailability(sortDoctorAvailability(loadedAvailability));
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

  const refreshAvailability = useCallback(
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
    const timeoutId = window.setTimeout(() => {
      refreshAvailability();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      loadController.current?.abort();
      loadController.current = null;
    };
  }, [refreshAvailability]);

  const mergeAvailability = useCallback(
    (updatedAvailability: DoctorAvailability) => {
      setAvailability((current) =>
        mergeDoctorAvailability(current, updatedAvailability, visibleRange),
      );
    },
    [visibleRange],
  );

  const removeAvailability = useCallback((availabilityId: number) => {
    setAvailability((current) =>
      current.filter((slot) => slot.id !== availabilityId),
    );
  }, []);

  return {
    availability,
    isLoading,
    loadError,
    mergeAvailability,
    refreshAvailability,
    removeAvailability,
  };
}
