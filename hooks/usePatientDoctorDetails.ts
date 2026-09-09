"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createAppointment } from "@/api/appointmentsApi";
import { getPatientDoctorById } from "@/api/patientDoctorsApi";
import { APPOINTMENT_BOOKING_FORM_FIELDS } from "@/constants/appointments";
import { usePatientAvailability } from "@/hooks/usePatientAvailability";
import { useToast } from "@/hooks/useToast";
import type { ApiFieldErrors } from "@/types/api";
import { ApiError } from "@/types/api";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import type { PatientDoctor } from "@/types/patientDoctor";
import { getUserFacingError } from "@/utils/apiErrors";
import type { AppointmentBookingFormValues } from "@/utils/validation/appointmentBookingValidation";
import { PATIENT_DOCTORS_TEXT } from "@/views/patientDoctors/PatientDoctorsText";

export function usePatientDoctorDetails(doctorId: number) {
  const { showToast } = useToast();
  const [doctor, setDoctor] = useState<PatientDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bookingAvailability, setBookingAvailability] =
    useState<DoctorAvailability | null>(null);
  const [bookingFieldErrors, setBookingFieldErrors] = useState<ApiFieldErrors>({});
  const isMounted = useRef(true);
  const availabilityState = usePatientAvailability({
    doctorId,
    enabled: Number.isInteger(doctorId) && doctorId > 0,
    loadErrorMessage: PATIENT_DOCTORS_TEXT.errors.availability,
  });

  const loadDoctor = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const loadedDoctor = await getPatientDoctorById(doctorId, signal);

        if (!signal?.aborted) {
          setDoctor(loadedDoctor);
        }
      } catch (error) {
        if (!signal?.aborted) {
          setLoadError(getUserFacingError(error, PATIENT_DOCTORS_TEXT.errors.details));
        }
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [doctorId],
  );

  useEffect(() => {
    isMounted.current = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void loadDoctor(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      isMounted.current = false;
      controller.abort();
    };
  }, [loadDoctor]);

  const openBookingDialog = (availability: DoctorAvailability) => {
    setBookingFieldErrors({});
    setBookingAvailability(availability);
  };

  const closeBookingDialog = () => {
    setBookingFieldErrors({});
    setBookingAvailability(null);
  };

  const saveAppointment = async (
    values: AppointmentBookingFormValues,
  ): Promise<boolean> => {
    if (!doctor || !bookingAvailability) {
      return false;
    }

    setBookingFieldErrors({});

    try {
      await createAppointment({
        doctorId: doctor.id,
        startTime: bookingAvailability.startTime,
        endTime: bookingAvailability.endTime,
        reason: values.reason.trim() || null,
        notes: values.notes.trim() || null,
      });

      if (!isMounted.current) {
        return true;
      }

      showToast(PATIENT_DOCTORS_TEXT.feedback.booked);
      closeBookingDialog();
      void availabilityState.refreshAvailability(false);
      return true;
    } catch (error) {
      if (!isMounted.current) {
        return false;
      }

      if (
        error instanceof ApiError &&
        error.status === 400 &&
        Object.keys(error.fieldErrors).length > 0
      ) {
        const supportedErrors = Object.fromEntries(
          Object.entries(error.fieldErrors).filter(([field]) =>
            APPOINTMENT_BOOKING_FORM_FIELDS.includes(
              field as (typeof APPOINTMENT_BOOKING_FORM_FIELDS)[number],
            ),
          ),
        );

        if (Object.keys(supportedErrors).length > 0) {
          setBookingFieldErrors(supportedErrors);
        }
      }

      showToast(getUserFacingError(error, PATIENT_DOCTORS_TEXT.errors.book), "error");
      return false;
    }
  };

  return {
    availabilityState,
    bookingAvailability,
    bookingFieldErrors,
    closeBookingDialog,
    doctor,
    isBookingOpen: Boolean(bookingAvailability),
    isLoading,
    loadError,
    openBookingDialog,
    retryLoadDoctor: () => void loadDoctor(),
    saveAppointment,
  };
}
