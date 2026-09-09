"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPatientProfile, updatePatient } from "@/api/patientsApi";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import type { ApiFieldErrors } from "@/types/api";
import { ApiError } from "@/types/api";
import type { Patient } from "@/types/patient";
import { getUserFacingError } from "@/utils/apiErrors";
import type { PatientProfileFormValues } from "@/utils/validation/patientProfileValidation";
import { PATIENT_PROFILE_TEXT } from "@/views/patientProfile/PatientProfileText";

export function usePatientProfile() {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const profileLoadController = useRef<AbortController | null>(null);
  const isMounted = useRef(true);

  const loadProfile = useCallback(async (signal: AbortSignal): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const loadedPatient = await getPatientProfile(signal);

      if (!signal.aborted) {
        setPatient(loadedPatient);
      }
    } catch (error) {
      if (!signal.aborted) {
        setLoadError(
          getUserFacingError(error, PATIENT_PROFILE_TEXT.errors.load),
        );
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const startProfileLoad = useCallback(() => {
    profileLoadController.current?.abort();
    const abortController = new AbortController();
    profileLoadController.current = abortController;

    void loadProfile(abortController.signal).finally(() => {
      if (profileLoadController.current === abortController) {
        profileLoadController.current = null;
      }
    });
  }, [loadProfile]);

  useEffect(() => {
    isMounted.current = true;
    const timeoutId = window.setTimeout(startProfileLoad, 0);

    return () => {
      isMounted.current = false;
      window.clearTimeout(timeoutId);
      profileLoadController.current?.abort();
      profileLoadController.current = null;
    };
  }, [startProfileLoad]);

  const saveProfile = async (
    values: PatientProfileFormValues,
  ): Promise<boolean> => {
    setFieldErrors({});

    if (!patient) {
      return false;
    }

    try {
      const updatedPatient = await updatePatient(patient.id, {
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
      });

      if (!isMounted.current) {
        return true;
      }

      setPatient(updatedPatient);

      updateUser({
        fullName: updatedPatient.fullName,
        email: updatedPatient.email,
      });

      showToast(PATIENT_PROFILE_TEXT.feedback.updated);
      return true;
    } catch (error) {
      if (!isMounted.current) {
        return false;
      }

      if (error instanceof ApiError) {
        if (error.status === 400 && Object.keys(error.fieldErrors).length > 0) {
          setFieldErrors(error.fieldErrors);
          return false;
        }

        if (error.status === 409) {
          setFieldErrors({ email: [error.message] });
          return false;
        }
      }

      showToast(
        getUserFacingError(error, PATIENT_PROFILE_TEXT.errors.save),
        "error",
      );
      return false;
    }
  };

  return {
    patient,
    isLoading,
    loadError,
    retryLoadProfile: startProfileLoad,
    fieldErrors,
    saveProfile,
  };
}
