"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDoctorAvailability } from "@/api/doctorAvailabilityApi";
import { useDoctorAvailabilityNavigation } from "@/hooks/useDoctorAvailabilityNavigation";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { getUserFacingError } from "@/utils/apiErrors";
import { sortDoctorAvailability } from "@/utils/doctorAvailability/availability";

interface UsePatientAvailabilityOptions {
  doctorId: number | null;
  enabled: boolean;
  loadErrorMessage: string;
}

export function usePatientAvailability({
  doctorId,
  enabled,
  loadErrorMessage,
}: UsePatientAvailabilityOptions) {
  const navigation = useDoctorAvailabilityNavigation();
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadController = useRef<AbortController | null>(null);

  const loadAvailability = useCallback(
    async (showLoading = true): Promise<void> => {
      loadController.current?.abort();

      if (!enabled || !doctorId) {
        setAvailability([]);
        setLoadError(null);
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      loadController.current = controller;

      if (showLoading) {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        const loadedAvailability = await getDoctorAvailability(
          doctorId,
          navigation.visibleRange,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setAvailability(sortDoctorAvailability(loadedAvailability));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(getUserFacingError(error, loadErrorMessage));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }

        if (loadController.current === controller) {
          loadController.current = null;
        }
      }
    },
    [doctorId, enabled, loadErrorMessage, navigation.visibleRange],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAvailability();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      loadController.current?.abort();
      loadController.current = null;
    };
  }, [loadAvailability]);

  return {
    availability,
    changeViewMode: navigation.changeViewMode,
    goToNext: navigation.goToNext,
    goToPrevious: navigation.goToPrevious,
    goToToday: navigation.goToToday,
    isLoading,
    loadError,
    refreshAvailability: loadAvailability,
    selectedDate: navigation.selectedDate,
    viewMode: navigation.viewMode,
  };
}
