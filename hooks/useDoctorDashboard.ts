"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDoctorDashboard } from "@/api/dashboardApi";
import type { DoctorDashboard } from "@/types/dashboard";
import { getUserFacingError } from "@/utils/apiErrors";
import { DOCTOR_DASHBOARD_TEXT } from "@/views/doctorDashboard/DoctorDashboardText";

export function useDoctorDashboard() {
  const [dashboard, setDashboard] = useState<DoctorDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadController = useRef<AbortController | null>(null);

  const refreshDashboard = useCallback(
    async (showLoading = true): Promise<void> => {
      loadController.current?.abort();
      const controller = new AbortController();
      loadController.current = controller;

      if (showLoading) {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        const loadedDashboard = await getDoctorDashboard(controller.signal);

        if (!controller.signal.aborted) {
          setDashboard(loadedDashboard);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            getUserFacingError(error, DOCTOR_DASHBOARD_TEXT.errors.load),
          );
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
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      loadController.current?.abort();
      loadController.current = null;
    };
  }, [refreshDashboard]);

  return {
    dashboard,
    isLoading,
    loadError,
    refreshDashboard,
  };
}
