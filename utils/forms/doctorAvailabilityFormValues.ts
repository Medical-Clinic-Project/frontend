import {
  DOCTOR_AVAILABILITY_DEFAULT_DURATION_MINUTES,
  DOCTOR_AVAILABILITY_DEFAULT_ROUNDING_MINUTES,
  DOCTOR_AVAILABILITY_DEFAULT_START_HOUR,
} from "@/constants/doctorAvailability";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import {
  addMinutes,
  startOfLocalDay,
  toLocalDateTimeInput,
} from "@/utils/doctorAvailability/dateTime";
import type { DoctorAvailabilityFormValues } from "@/utils/validation/doctorAvailabilityValidation";

export function roundUpToMinutes(value: Date, minutes: number): Date {
  const result = new Date(value);
  result.setSeconds(0, 0);
  const remainder = result.getMinutes() % minutes;

  if (remainder || result.getTime() <= value.getTime()) {
    result.setMinutes(result.getMinutes() + (minutes - remainder));
  }

  return result;
}

export function getCreateDoctorAvailabilityFormValues(
  selectedDate: Date,
  now = new Date(),
): DoctorAvailabilityFormValues {
  const selectedStart = startOfLocalDay(selectedDate);
  selectedStart.setHours(DOCTOR_AVAILABILITY_DEFAULT_START_HOUR);
  const start =
    selectedStart > now
      ? selectedStart
      : roundUpToMinutes(now, DOCTOR_AVAILABILITY_DEFAULT_ROUNDING_MINUTES);

  return {
    startTime: toLocalDateTimeInput(start),
    endTime: toLocalDateTimeInput(
      addMinutes(start, DOCTOR_AVAILABILITY_DEFAULT_DURATION_MINUTES),
    ),
  };
}

export function getDoctorAvailabilityEditFormValues(
  availability: DoctorAvailability,
): DoctorAvailabilityFormValues {
  return {
    startTime: toLocalDateTimeInput(new Date(availability.startTime)),
    endTime: toLocalDateTimeInput(new Date(availability.endTime)),
  };
}
