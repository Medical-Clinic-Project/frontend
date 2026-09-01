import type {
  DoctorAvailability,
  DoctorAvailabilityRange,
} from "@/types/doctorAvailability";

export type AvailabilityViewMode = "day" | "week";

const DAYS_IN_WEEK = 7;

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function startOfLocalDay(value: Date): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
  );
}

export function addDays(value: Date, days: number): Date {
  const result = startOfLocalDay(value);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfLocalWeek(value: Date): Date {
  const day = value.getDay();
  const daysSinceMonday = (day + 6) % DAYS_IN_WEEK;
  return addDays(value, -daysSinceMonday);
}

export function getVisibleDays(
  selectedDate: Date,
  mode: AvailabilityViewMode,
): Date[] {
  const firstDay =
    mode === "day"
      ? startOfLocalDay(selectedDate)
      : startOfLocalWeek(selectedDate);
  const count = mode === "day" ? 1 : DAYS_IN_WEEK;

  return Array.from({ length: count }, (_, index) =>
    addDays(firstDay, index),
  );
}

export function getAvailabilityRange(
  selectedDate: Date,
  mode: AvailabilityViewMode,
): DoctorAvailabilityRange {
  const days = getVisibleDays(selectedDate, mode);
  const from = days[0];
  const to = addDays(days[days.length - 1], 1);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

export function navigateDate(
  selectedDate: Date,
  mode: AvailabilityViewMode,
  direction: -1 | 1,
): Date {
  return addDays(selectedDate, direction * (mode === "day" ? 1 : DAYS_IN_WEEK));
}

export function formatVisibleRange(
  selectedDate: Date,
  mode: AvailabilityViewMode,
): string {
  const days = getVisibleDays(selectedDate, mode);
  const firstDay = days[0];

  if (mode === "day") {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(firstDay);
  }

  const lastDay = days[days.length - 1];
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  });
  const year = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
  }).format(lastDay);

  return `${formatter.format(firstDay)} - ${formatter.format(lastDay)}, ${year}`;
}

export function formatDayHeader(value: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(value);
}

export function formatTime(value: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function formatAvailabilityRange(
  availability: DoctorAvailability,
): string {
  return formatDateTimeRange(availability.startTime, availability.endTime);
}

export function formatDateTimeRange(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

export function toLocalDateTimeInput(value: Date): string {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
    value.getDate(),
  )}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export function parseLocalDateTimeInput(input: string): Date | null {
  const [datePart = "", timePart = ""] = input.split("T");
  const dateParts = datePart.split("-").map(Number);
  const timeParts = timePart.split(":").map(Number);

  if (dateParts.length !== 3 || timeParts.length < 2) {
    return null;
  }

  const [year, month, day] = dateParts;
  const [hours, minutes] = timeParts;
  const value = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (
    Number.isNaN(value.getTime()) ||
    value.getFullYear() !== year ||
    value.getMonth() !== month - 1 ||
    value.getDate() !== day ||
    value.getHours() !== hours ||
    value.getMinutes() !== minutes
  ) {
    return null;
  }

  return value;
}

export function addMinutes(value: Date, minutes: number): Date {
  return new Date(value.getTime() + minutes * 60 * 1000);
}

export function getDurationMinutes(
  availability: DoctorAvailability,
): number {
  return (
    (new Date(availability.endTime).getTime() -
      new Date(availability.startTime).getTime()) /
    (60 * 1000)
  );
}

export function intersectsRange(
  availability: DoctorAvailability,
  range: DoctorAvailabilityRange,
): boolean {
  return (
    new Date(availability.startTime).getTime() <
      new Date(range.to).getTime() &&
    new Date(availability.endTime).getTime() >
      new Date(range.from).getTime()
  );
}

export function isSameInstant(left: Date, right: Date): boolean {
  return Math.abs(left.getTime() - right.getTime()) < 1000;
}
