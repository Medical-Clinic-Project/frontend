"use client";

import { useState } from "react";
import { updateAppointmentStatus } from "@/api/appointmentsApi";
import { APPOINTMENT_STATUSES } from "@/constants/appointments";
import { useToast } from "@/hooks/useToast";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { getUserFacingError } from "@/utils/apiErrors";
import { canUpdateDoctorAppointmentStatus } from "@/utils/appointments";
import { DOCTOR_APPOINTMENTS_TEXT } from "@/views/doctorAppointments/DoctorAppointmentsText";

interface UseDoctorAppointmentActionsOptions {
  refreshAppointments: (showLoading?: boolean) => Promise<void>;
}

interface StatusUpdateTarget {
  appointment: Appointment;
  status: Exclude<AppointmentStatus, typeof APPOINTMENT_STATUSES.PENDING>;
}

export function useDoctorAppointmentActions({
  refreshAppointments,
}: UseDoctorAppointmentActionsOptions) {
  const { showToast } = useToast();
  const [statusUpdateTarget, setStatusUpdateTarget] =
    useState<StatusUpdateTarget | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const requestStatusUpdate = (
    appointment: Appointment,
    status: Exclude<AppointmentStatus, typeof APPOINTMENT_STATUSES.PENDING>,
  ) => {
    if (!canUpdateDoctorAppointmentStatus(appointment, status)) {
      showToast(DOCTOR_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
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

    if (!canUpdateDoctorAppointmentStatus(appointment, status)) {
      closeStatusUpdateDialog();
      showToast(DOCTOR_APPOINTMENTS_TEXT.errors.noLongerEligible, "error");
      return;
    }

    setIsUpdatingStatus(true);

    try {
      await updateAppointmentStatus(appointment.id, { status });
      await refreshAppointments(false);
      setStatusUpdateTarget(null);
      showToast(DOCTOR_APPOINTMENTS_TEXT.feedback[status]);
    } catch (error) {
      showToast(
        getUserFacingError(error, DOCTOR_APPOINTMENTS_TEXT.errors.updateStatus),
        "error",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return {
    closeStatusUpdateDialog,
    confirmStatusUpdate,
    isStatusUpdateDialogOpen: Boolean(statusUpdateTarget),
    isUpdatingStatus,
    requestStatusUpdate,
    statusUpdateTarget,
  };
}
