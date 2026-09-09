import {
  DOCTOR_AVAILABILITY_CALENDAR_DAY_MIN_WIDTH,
  DOCTOR_AVAILABILITY_CALENDAR_DEFAULT_END_HOUR,
  DOCTOR_AVAILABILITY_CALENDAR_DEFAULT_START_HOUR,
  DOCTOR_AVAILABILITY_CALENDAR_DRAG_SNAP_MINUTES,
  DOCTOR_AVAILABILITY_CALENDAR_HOUR_HEIGHT,
  DOCTOR_AVAILABILITY_CALENDAR_MIN_SLOT_HEIGHT,
  DOCTOR_AVAILABILITY_CALENDAR_TIME_GUTTER_WIDTH,
} from "@/constants/doctorAvailability";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import {
  addDays,
  formatTime,
  startOfLocalDay,
} from "@/utils/doctorAvailability/dateTime";

export interface AvailabilityCalendarSegment {
  availability: DoctorAvailability;
  dayIndex: number;
  start: Date;
  end: Date;
}

export interface AvailabilityCalendarLayout {
  calendarHeight: number;
  minimumWidth: number;
}

export interface AvailabilitySegmentLayout {
  top: number;
  height: number;
}

export interface AvailabilityCalendarHourMarker {
  hour: number;
  position: number;
  label: string;
}

export function getAvailabilityCalendarSegments(
  availability: readonly DoctorAvailability[],
  days: readonly Date[],
): AvailabilityCalendarSegment[] {
  return availability.flatMap((slot) => {
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);

    return days.flatMap((day, dayIndex) => {
      const dayStart = startOfLocalDay(day);
      const dayEnd = addDays(dayStart, 1);
      const start = new Date(
        Math.max(slotStart.getTime(), dayStart.getTime()),
      );
      const end = new Date(Math.min(slotEnd.getTime(), dayEnd.getTime()));

      return end > start
        ? [{ availability: slot, dayIndex, start, end }]
        : [];
    });
  });
}

export function getCalendarDisplayHours(
  segments: readonly AvailabilityCalendarSegment[],
): { startHour: number; endHour: number } {
  let startHour = DOCTOR_AVAILABILITY_CALENDAR_DEFAULT_START_HOUR;
  let endHour = DOCTOR_AVAILABILITY_CALENDAR_DEFAULT_END_HOUR;

  for (const segment of segments) {
    const segmentStartHour = segment.start.getHours();
    const nextDayStart = addDays(startOfLocalDay(segment.start), 1);
    const segmentEndHour =
      segment.end.getTime() === nextDayStart.getTime()
        ? 24
        : segment.end.getHours() +
          (segment.end.getMinutes() > 0 ? 1 : 0);
    startHour = Math.min(startHour, segmentStartHour);
    endHour = Math.max(endHour, segmentEndHour);
  }

  return {
    startHour: Math.max(0, startHour),
    endHour: Math.min(24, Math.max(startHour + 1, endHour)),
  };
}

export function getAvailabilityCalendarLayout(
  startHour: number,
  endHour: number,
  dayCount: number,
): AvailabilityCalendarLayout {
  const totalMinutes = (endHour - startHour) * 60;

  return {
    calendarHeight:
      (totalMinutes / 60) * DOCTOR_AVAILABILITY_CALENDAR_HOUR_HEIGHT,
    minimumWidth:
      DOCTOR_AVAILABILITY_CALENDAR_TIME_GUTTER_WIDTH +
      dayCount * DOCTOR_AVAILABILITY_CALENDAR_DAY_MIN_WIDTH,
  };
}

export function getAvailabilityCalendarHourMarkers(
  startHour: number,
  endHour: number,
): AvailabilityCalendarHourMarker[] {
  return Array.from({ length: endHour - startHour }, (_, index) => {
    const hour = startHour + index;

    return {
      hour,
      position:
        (hour - startHour) * DOCTOR_AVAILABILITY_CALENDAR_HOUR_HEIGHT,
      label: formatTime(new Date(2000, 0, 1, hour, 0, 0, 0)),
    };
  });
}

export function getAvailabilitySegmentsByDay(
  segments: readonly AvailabilityCalendarSegment[],
  dayCount: number,
): AvailabilityCalendarSegment[][] {
  const segmentsByDay = Array.from(
    { length: dayCount },
    (): AvailabilityCalendarSegment[] => [],
  );

  for (const segment of segments) {
    segmentsByDay[segment.dayIndex]?.push(segment);
  }

  return segmentsByDay;
}

export function getAvailabilitySegmentLayout(
  segment: AvailabilityCalendarSegment,
  startHour: number,
): AvailabilitySegmentLayout {
  const startMinutes =
    segment.start.getHours() * 60 + segment.start.getMinutes() - startHour * 60;
  const durationMinutes = Math.max(
    1,
    (segment.end.getTime() - segment.start.getTime()) / (60 * 1000),
  );

  return {
    top: (startMinutes / 60) * DOCTOR_AVAILABILITY_CALENDAR_HOUR_HEIGHT,
    height: Math.max(
      (durationMinutes / 60) * DOCTOR_AVAILABILITY_CALENDAR_HOUR_HEIGHT,
      DOCTOR_AVAILABILITY_CALENDAR_MIN_SLOT_HEIGHT,
    ),
  };
}

export function getAvailabilitySegmentTimeLabels(
  segment: AvailabilityCalendarSegment,
): { startLabel: string; endLabel: string } {
  return {
    startLabel: formatTime(new Date(segment.availability.startTime)),
    endLabel: formatTime(new Date(segment.availability.endTime)),
  };
}

export function getAvailabilityDropStart(
  day: Date,
  startHour: number,
  endHour: number,
  pointerOffset: number,
  containerHeight: number,
): Date {
  const totalMinutes = (endHour - startHour) * 60;
  const boundedPointerOffset = Math.min(
    Math.max(pointerOffset, 0),
    containerHeight,
  );
  const rawMinutes =
    (boundedPointerOffset / containerHeight) * totalMinutes;
  const snappedMinutes = Math.min(
    Math.round(rawMinutes / DOCTOR_AVAILABILITY_CALENDAR_DRAG_SNAP_MINUTES) *
      DOCTOR_AVAILABILITY_CALENDAR_DRAG_SNAP_MINUTES,
    totalMinutes - DOCTOR_AVAILABILITY_CALENDAR_DRAG_SNAP_MINUTES,
  );
  const result = startOfLocalDay(day);
  result.setMinutes(startHour * 60 + snappedMinutes);
  return result;
}
