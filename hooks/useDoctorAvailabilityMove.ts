"use client";

import { useState, type RefObject } from "react";
import { updateDoctorAvailability } from "@/api/doctorAvailabilityApi";
import { useToast } from "@/hooks/useToast";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { getUserFacingError } from "@/utils/apiErrors";
import {
  addMinutes,
  getDurationMinutes,
  isSameInstant,
} from "@/utils/doctorAvailability/dateTime";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityText";

interface UseDoctorAvailabilityMoveOptions {
  isMounted: RefObject<boolean>;
  mergeAvailability: (availability: DoctorAvailability) => void;
  refreshAvailability: (showLoading?: boolean) => void;
}

export function useDoctorAvailabilityMove({
  isMounted,
  mergeAvailability,
  refreshAvailability,
}: UseDoctorAvailabilityMoveOptions) {
  const { showToast } = useToast();
  const [movingAvailabilityId, setMovingAvailabilityId] =
    useState<number | null>(null);

  const moveAvailability = async (
    slot: DoctorAvailability,
    newStart: Date,
  ): Promise<void> => {
    if (movingAvailabilityId !== null) {
      return;
    }

    const previousStart = new Date(slot.startTime);

    if (isSameInstant(previousStart, newStart)) {
      return;
    }

    if (newStart < new Date()) {
      showToast(DOCTOR_AVAILABILITY_TEXT.errors.movePast, "error");
      return;
    }

    const newEnd = addMinutes(newStart, getDurationMinutes(slot));
    const optimisticAvailability: DoctorAvailability = {
      ...slot,
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
    };

    setMovingAvailabilityId(slot.id);
    mergeAvailability(optimisticAvailability);

    try {
      const updatedAvailability = await updateDoctorAvailability(slot.id, {
        startTime: optimisticAvailability.startTime,
        endTime: optimisticAvailability.endTime,
      });

      if (!isMounted.current) {
        return;
      }

      mergeAvailability(updatedAvailability);
      showToast(DOCTOR_AVAILABILITY_TEXT.feedback.moved);
    } catch (error) {
      if (!isMounted.current) {
        return;
      }

      mergeAvailability(slot);
      showToast(
        getUserFacingError(error, DOCTOR_AVAILABILITY_TEXT.errors.move),
        "error",
      );
      refreshAvailability(false);
    } finally {
      if (isMounted.current) {
        setMovingAvailabilityId(null);
      }
    }
  };

  return {
    moveAvailability,
    movingAvailabilityId,
  };
}
