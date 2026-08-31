"use client";

import { useEffect, useRef } from "react";
import { useDoctorAvailabilityData } from "@/hooks/useDoctorAvailabilityData";
import { useDoctorAvailabilityDelete } from "@/hooks/useDoctorAvailabilityDelete";
import { useDoctorAvailabilityForm } from "@/hooks/useDoctorAvailabilityForm";
import { useDoctorAvailabilityMove } from "@/hooks/useDoctorAvailabilityMove";
import { useDoctorAvailabilityNavigation } from "@/hooks/useDoctorAvailabilityNavigation";

export function useDoctorAvailability() {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const navigation = useDoctorAvailabilityNavigation();
  const data = useDoctorAvailabilityData({
    visibleRange: navigation.visibleRange,
  });
  const form = useDoctorAvailabilityForm({
    isMounted,
    mergeAvailability: data.mergeAvailability,
    refreshAvailability: data.refreshAvailability,
    setSelectedDate: navigation.setSelectedDate,
  });
  const deletion = useDoctorAvailabilityDelete({
    isMounted,
    removeAvailability: data.removeAvailability,
  });
  const movement = useDoctorAvailabilityMove({
    isMounted,
    mergeAvailability: data.mergeAvailability,
    refreshAvailability: data.refreshAvailability,
  });

  const requestDelete = () => {
    if (!form.selectedAvailability) {
      return;
    }

    deletion.requestDelete(form.selectedAvailability);
    form.hideFormDialog();
  };

  const closeDeleteDialog = () => {
    if (deletion.isDeleting) {
      return;
    }

    deletion.closeDeleteDialog();
    form.clearSelectedAvailability();
  };

  const confirmDelete = async (): Promise<void> => {
    const wasDeleted = await deletion.confirmDelete();

    if (wasDeleted) {
      form.clearSelectedAvailability();
    }
  };

  return {
    availability: data.availability,
    changeViewMode: navigation.changeViewMode,
    closeDeleteDialog,
    closeFormDialog: form.closeFormDialog,
    confirmDelete,
    deleteAvailability: deletion.deleteAvailability,
    formFieldErrors: form.formFieldErrors,
    goToNext: navigation.goToNext,
    goToPrevious: navigation.goToPrevious,
    goToToday: navigation.goToToday,
    isDeleteOpen: deletion.isDeleteOpen,
    isDeleting: deletion.isDeleting,
    isFormOpen: form.isFormOpen,
    isLoading: data.isLoading,
    loadError: data.loadError,
    moveAvailability: movement.moveAvailability,
    movingAvailabilityId: movement.movingAvailabilityId,
    openCreateDialog: form.openCreateDialog,
    openEditDialog: form.openEditDialog,
    requestDelete,
    retryLoad: data.refreshAvailability,
    saveAvailability: form.saveAvailability,
    selectedAvailability: form.selectedAvailability,
    selectedDate: navigation.selectedDate,
    viewMode: navigation.viewMode,
  };
}
