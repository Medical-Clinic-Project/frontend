import type {
  DoctorAvailability,
  DoctorAvailabilityRange,
  DoctorAvailabilityRequest,
} from "@/types/doctorAvailability";
import { intersectsRange, parseLocalDateTimeInput } from "@/utils/doctorAvailability/dateTime";
import type { DoctorAvailabilityFormValues } from "@/utils/validation/doctorAvailabilityValidation";

export function sortDoctorAvailability(
  availability: readonly DoctorAvailability[],
): DoctorAvailability[] {
  return [...availability].sort((left, right) => {
    const timeDifference =
      new Date(left.startTime).getTime() -
      new Date(right.startTime).getTime();

    return timeDifference || left.id - right.id;
  });
}

export function mergeDoctorAvailability(
  availability: readonly DoctorAvailability[],
  updated: DoctorAvailability,
  range: DoctorAvailabilityRange,
): DoctorAvailability[] {
  const withoutUpdated = availability.filter(
    (slot) => slot.id !== updated.id,
  );

  return intersectsRange(updated, range)
    ? sortDoctorAvailability([...withoutUpdated, updated])
    : sortDoctorAvailability(withoutUpdated);
}

export function getDoctorAvailabilityRequest(
  values: DoctorAvailabilityFormValues,
): DoctorAvailabilityRequest | null {
  const start = parseLocalDateTimeInput(values.startTime);
  const end = parseLocalDateTimeInput(values.endTime);

  if (!start || !end) {
    return null;
  }

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}
