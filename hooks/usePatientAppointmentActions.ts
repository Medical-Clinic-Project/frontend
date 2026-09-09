"use client";

import { useState } from "react";
import {
  cancelAppointment,
  rescheduleAppointment,
} from "@/api/appointmentsApi";
import { usePatientAvailability } from "@/hooks/usePatientAvailability";
import { useToast } from "@/hooks/useToast";
import type { Appointment } from "@/types/appointment";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { getUserFacingError } from "@/utils/apiErrors";
import { canManagePatientAppointment } from "@/utils/appointments";
import { PATIENT_APPOINTMENTS_TEXT } from "@/views/patientAppointments/PatientAppointmentsText";

interface UsePatientAppointmentActionsOptions {
  refreshAppointments: (showLoading?: boolean) => Promise<void>;
}

export function usePatientAppointmentActions({
  refreshAppointments,
}: UsePatientAppointmentActionsOptions) {
  const { showToast } = useToast();
  const [cancellationAppointment, setCancellationAppointment] =
    useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const availabilityState = usePatientAvailability({
    doctorId: rescheduleTarget?.doctorId ?? null,
    enabled: Boolean(rescheduleTarget),
    loadErrorMessage: PATIENT_APPOINTMENTS_TEXT.errors.availability,
  });

  const requestCancellation = (appointment: Appointment) => {
    if (!canManagePatientAppointment(appointment)) {
      showToast(PATIENT_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
      return;
    }

    setCancellationAppointment(appointment);
  };

  const closeCancellationDialog = () => {
    if (!isCancelling) {
      setCancellationAppointment(null);
    }
  };

  const confirmCancellation = async (): Promise<void> => {
    if (!cancellationAppointment || isCancelling) {
      return;
    }

    if (!canManagePatientAppointment(cancellationAppointment)) {
      closeCancellationDialog();
      showToast(PATIENT_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
      return;
    }

    setIsCancelling(true);

    try {
      await cancelAppointment(cancellationAppointment.id);
      await refreshAppointments(false);
      setCancellationAppointment(null);
      showToast(PATIENT_APPOINTMENTS_TEXT.feedback.cancelled);
    } catch (error) {
      showToast(getUserFacingError(error, PATIENT_APPOINTMENTS_TEXT.errors.cancel), "error");
    } finally {
      setIsCancelling(false);
    }
  };

  const openRescheduleDialog = (appointment: Appointment) => {
    if (!canManagePatientAppointment(appointment)) {
      showToast(PATIENT_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
      return;
    }

    setRescheduleTarget(appointment);
  };

  const closeRescheduleDialog = () => {
    if (!isRescheduling) {
      setRescheduleTarget(null);
    }
  };

  const rescheduleToAvailability = async (
    availability: DoctorAvailability,
  ): Promise<void> => {
    if (!rescheduleTarget || isRescheduling) {
      return;
    }

    if (!canManagePatientAppointment(rescheduleTarget)) {
      closeRescheduleDialog();
      showToast(PATIENT_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
      return;
    }

    setIsRescheduling(true);

    try {
      await rescheduleAppointment(rescheduleTarget.id, {
        startTime: availability.startTime,
        endTime: availability.endTime,
      });
      await Promise.all([
        refreshAppointments(false),
        availabilityState.refreshAvailability(false),
      ]);
      setRescheduleTarget(null);
      showToast(PATIENT_APPOINTMENTS_TEXT.feedback.rescheduled);
    } catch (error) {
      showToast(
        getUserFacingError(error, PATIENT_APPOINTMENTS_TEXT.errors.reschedule),
        "error",
      );
    } finally {
      setIsRescheduling(false);
    }
  };

  return {
    cancellationAppointment,
    closeCancellationDialog,
    closeRescheduleDialog,
    confirmCancellation,
    isCancelling,
    isCancellationDialogOpen: Boolean(cancellationAppointment),
    isRescheduleDialogOpen: Boolean(rescheduleTarget),
    isRescheduling,
    openRescheduleDialog,
    requestCancellation,
    rescheduleAvailabilityState: availabilityState,
    rescheduleTarget,
    rescheduleToAvailability,
  };
}
