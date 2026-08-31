"use client";

import { useMemo, useState } from "react";
import {
  getAvailabilityRange,
  navigateDate,
  startOfLocalDay,
  type AvailabilityViewMode,
} from "@/utils/doctorAvailability/dateTime";

export function useDoctorAvailabilityNavigation() {
  const [viewMode, setViewMode] =
    useState<AvailabilityViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(() =>
    startOfLocalDay(new Date()),
  );
  const visibleRange = useMemo(
    () => getAvailabilityRange(selectedDate, viewMode),
    [selectedDate, viewMode],
  );

  const changeViewMode = (mode: AvailabilityViewMode) => {
    if (mode !== viewMode) {
      setViewMode(mode);
    }
  };

  const goToToday = () => {
    setSelectedDate(startOfLocalDay(new Date()));
  };

  const goToPrevious = () => {
    setSelectedDate((current) => navigateDate(current, viewMode, -1));
  };

  const goToNext = () => {
    setSelectedDate((current) => navigateDate(current, viewMode, 1));
  };

  return {
    changeViewMode,
    goToNext,
    goToPrevious,
    goToToday,
    selectedDate,
    setSelectedDate,
    viewMode,
    visibleRange,
  };
}
