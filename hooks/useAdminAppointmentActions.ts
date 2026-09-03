"use client";

import { useState } from "react";
import {
  cancelAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
} from "@/api/appointmentsApi";
import { usePatientAvailability } from "@/hooks/usePatientAvailability";
import { useToast } from "@/hooks/useToast";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { getUserFacingError } from "@/utils/apiErrors";
import {
  canRescheduleAdminAppointment,
  canUpdateAdminAppointmentStatus,
} from "@/utils/appointments";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

interface UseAdminAppointmentActionsOptions {
  refreshAppointments: (showLoading?: boolean) => Promise<void>;
}

interface StatusUpdateTarget {
  appointment: Appointment;
  status: Exclude<AppointmentStatus, "Pending">;
}

export function useAdminAppointmentActions({
  refreshAppointments,
}: UseAdminAppointmentActionsOptions) {
  const { showToast } = useToast();
  const [statusUpdateTarget, setStatusUpdateTarget] =
    useState<StatusUpdateTarget | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const availabilityState = usePatientAvailability({
    doctorId: rescheduleTarget?.doctorId ?? null,
    enabled: Boolean(rescheduleTarget),
    loadErrorMessage: ADMIN_APPOINTMENTS_TEXT.errors.availability,
  });

  const requestStatusUpdate = (
    appointment: Appointment,
    status: Exclude<AppointmentStatus, "Pending">,
  ) => {
    if (!canUpdateAdminAppointmentStatus(appointment, status)) {
      showToast(ADMIN_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
      return;
    }

    setStatusUpdateTarget({ appointment, status });
  };

  const closeStatusUpdateDialog = () => {
    if (!isUpdatingStatus) {
      setStatusUpdateTarget(null);
    }
  };

  const confirmStatusUpdate = async (): Promise<void> => {
    if (!statusUpdateTarget || isUpdatingStatus) {
      return;
    }

    const { appointment, status } = statusUpdateTarget;

    if (!canUpdateAdminAppointmentStatus(appointment, status)) {
      closeStatusUpdateDialog();
      showToast(ADMIN_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
      return;
    }

    setIsUpdatingStatus(true);

    try {
      if (status === "Cancelled") {
        await cancelAppointment(appointment.id);
      } else {
        await updateAppointmentStatus(appointment.id, { status });
      }

      await refreshAppointments(false);
      setStatusUpdateTarget(null);
      showToast(ADMIN_APPOINTMENTS_TEXT.feedback[status]);
    } catch (error) {
      showToast(
        getUserFacingError(error, ADMIN_APPOINTMENTS_TEXT.errors.updateStatus),
        "error",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const openRescheduleDialog = (appointment: Appointment) => {
    if (!canRescheduleAdminAppointment(appointment)) {
      showToast(ADMIN_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
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

    if (!canRescheduleAdminAppointment(rescheduleTarget)) {
      closeRescheduleDialog();
      showToast(ADMIN_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
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
      showToast(ADMIN_APPOINTMENTS_TEXT.feedback.rescheduled);
    } catch (error) {
      showToast(
        getUserFacingError(error, ADMIN_APPOINTMENTS_TEXT.errors.reschedule),
        "error",
      );
    } finally {
      setIsRescheduling(false);
    }
  };

  return {
    availabilityState,
    closeRescheduleDialog,
    closeStatusUpdateDialog,
    confirmStatusUpdate,
    isRescheduleDialogOpen: Boolean(rescheduleTarget),
    isRescheduling,
    isStatusUpdateDialogOpen: Boolean(statusUpdateTarget),
    isUpdatingStatus,
    openRescheduleDialog,
    requestStatusUpdate,
    rescheduleTarget,
    rescheduleToAvailability,
    statusUpdateTarget,
  };
}
