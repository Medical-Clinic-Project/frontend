import type { DragEvent } from "react";
import {
  Box,
  ButtonBase,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import {
  addDays,
  formatDayHeader,
  formatTime,
  startOfLocalDay,
  type AvailabilityViewMode,
} from "@/views/doctorAvailability/doctorAvailabilityDates";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityView.text";
import {
  CALENDAR_DAY_MIN_WIDTH,
  CALENDAR_DEFAULT_END_HOUR,
  CALENDAR_DEFAULT_START_HOUR,
  CALENDAR_DRAG_SNAP_MINUTES,
  CALENDAR_HOUR_HEIGHT,
  CALENDAR_MIN_SLOT_HEIGHT,
  CALENDAR_TIME_GUTTER_WIDTH,
} from "@/constants/calendarConstants";

interface AvailabilityCalendarProps {
  availability: readonly DoctorAvailability[];
  days: readonly Date[];
  viewMode: AvailabilityViewMode;
  movingAvailabilityId: number | null;
  onSelect: (availability: DoctorAvailability) => void;
  onMove: (
    availability: DoctorAvailability,
    newStart: Date,
  ) => void | Promise<void>;
}

interface CalendarSegment {
  availability: DoctorAvailability;
  dayIndex: number;
  start: Date;
  end: Date;
}

const AVAILABILITY_DRAG_DATA_TYPE =
  "application/x-doctor-availability-id";

function getSegments(
  availability: readonly DoctorAvailability[],
  days: readonly Date[],
): CalendarSegment[] {
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

function getDisplayHours(segments: readonly CalendarSegment[]): {
  startHour: number;
  endHour: number;
} {
  let startHour = CALENDAR_DEFAULT_START_HOUR;
  let endHour = CALENDAR_DEFAULT_END_HOUR;

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

function minutesFromStartOfDay(value: Date): number {
  return value.getHours() * 60 + value.getMinutes();
}

function getDropStart(
  event: DragEvent<HTMLElement>,
  day: Date,
  startHour: number,
  endHour: number,
): Date {
  const bounds = event.currentTarget.getBoundingClientRect();
  const totalMinutes = (endHour - startHour) * 60;
  const pointerOffset = Math.min(
    Math.max(event.clientY - bounds.top, 0),
    bounds.height,
  );
  const rawMinutes = (pointerOffset / bounds.height) * totalMinutes;
  const snappedMinutes = Math.min(
    Math.round(rawMinutes / CALENDAR_DRAG_SNAP_MINUTES) *
      CALENDAR_DRAG_SNAP_MINUTES,
    totalMinutes - CALENDAR_DRAG_SNAP_MINUTES,
  );
  const result = startOfLocalDay(day);
  result.setMinutes(startHour * 60 + snappedMinutes);
  return result;
}

export function AvailabilityCalendar({
  availability,
  days,
  viewMode,
  movingAvailabilityId,
  onSelect,
  onMove,
}: AvailabilityCalendarProps) {
  const segments = getSegments(availability, days);
  const { startHour, endHour } = getDisplayHours(segments);
  const totalMinutes = (endHour - startHour) * 60;
  const calendarHeight =
    (totalMinutes / 60) * CALENDAR_HOUR_HEIGHT;
  const gridTemplateColumns = `${CALENDAR_TIME_GUTTER_WIDTH}px repeat(${days.length}, minmax(${CALENDAR_DAY_MIN_WIDTH}px, 1fr))`;
  const minimumWidth =
    CALENDAR_TIME_GUTTER_WIDTH + days.length * CALENDAR_DAY_MIN_WIDTH;
  const hourMarkers = Array.from(
    { length: endHour - startHour },
    (_, index) => startHour + index,
  );

  const handleDrop = (
    event: DragEvent<HTMLElement>,
    day: Date,
  ) => {
    event.preventDefault();
    const availabilityId = Number(
      event.dataTransfer.getData(AVAILABILITY_DRAG_DATA_TYPE),
    );
    const slot = availability.find((item) => item.id === availabilityId);

    if (!slot || movingAvailabilityId !== null) {
      return;
    }

    void onMove(
      slot,
      getDropStart(event, day, startHour, endHour),
    );
  };

  return (
    <Paper variant="outlined">
      <Stack spacing={1.5} sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Typography variant="body2" color="text.secondary">
          {DOCTOR_AVAILABILITY_TEXT.calendar.dragHint}
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: minimumWidth }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Stack
                sx={{
                  minHeight: 56,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {DOCTOR_AVAILABILITY_TEXT.calendar.time}
                </Typography>
              </Stack>
              {days.map((day) => (
                <Stack
                  key={day.toISOString()}
                  sx={{
                    minHeight: 56,
                    alignItems: "center",
                    justifyContent: "center",
                    borderLeft: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant={viewMode === "day" ? "body1" : "body2"}
                    sx={{ fontWeight: 650 }}
                  >
                    {formatDayHeader(day)}
                  </Typography>
                </Stack>
              ))}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns,
                height: calendarHeight,
              }}
            >
              <Box sx={{ position: "relative" }}>
                {hourMarkers.map((hour) => (
                  <Typography
                    key={hour}
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      position: "absolute",
                      insetInline: 0,
                      top: (hour - startHour) * CALENDAR_HOUR_HEIGHT,
                      px: 1,
                      transform: "translateY(-50%)",
                      textAlign: "center",
                    }}
                  >
                    {formatTime(
                      new Date(2000, 0, 1, hour, 0, 0, 0),
                    )}
                  </Typography>
                ))}
              </Box>

              {days.map((day, dayIndex) => (
                <Box
                  key={day.toISOString()}
                  onDragOver={(event) => {
                    if (movingAvailabilityId === null) {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }
                  }}
                  onDrop={(event) => handleDrop(event, day)}
                  sx={{
                    position: "relative",
                    borderLeft: 1,
                    borderColor: "divider",
                    backgroundImage: (theme) =>
                      `repeating-linear-gradient(to bottom, transparent 0, transparent ${
                        CALENDAR_HOUR_HEIGHT / 2 - 1
                      }px, ${theme.palette.divider} ${
                        CALENDAR_HOUR_HEIGHT / 2 - 1
                      }px, ${theme.palette.divider} ${
                        CALENDAR_HOUR_HEIGHT / 2
                      }px)`,
                  }}
                >
                  {segments
                    .filter((segment) => segment.dayIndex === dayIndex)
                    .map((segment) => {
                      const startMinutes =
                        minutesFromStartOfDay(segment.start) -
                        startHour * 60;
                      const durationMinutes = Math.max(
                        1,
                        (segment.end.getTime() -
                          segment.start.getTime()) /
                          (60 * 1000),
                      );
                      const top =
                        (startMinutes / 60) * CALENDAR_HOUR_HEIGHT;
                      const height = Math.max(
                        (durationMinutes / 60) * CALENDAR_HOUR_HEIGHT,
                        CALENDAR_MIN_SLOT_HEIGHT,
                      );
                      const startLabel = formatTime(
                        new Date(segment.availability.startTime),
                      );
                      const endLabel = formatTime(
                        new Date(segment.availability.endTime),
                      );
                      const isMoving =
                        movingAvailabilityId ===
                        segment.availability.id;

                      return (
                        <Tooltip
                          key={`${segment.availability.id}-${dayIndex}`}
                          title={`${startLabel} - ${endLabel}`}
                          arrow
                        >
                          <ButtonBase
                            draggable={!isMoving}
                            disabled={isMoving}
                            aria-label={DOCTOR_AVAILABILITY_TEXT.calendar.slotLabel(
                              startLabel,
                              endLabel,
                            )}
                            onClick={() =>
                              onSelect(segment.availability)
                            }
                            onDragStart={(event) => {
                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData(
                                AVAILABILITY_DRAG_DATA_TYPE,
                                segment.availability.id.toString(),
                              );
                            }}
                            sx={{
                              position: "absolute",
                              top,
                              left: 4,
                              right: 4,
                              height,
                              zIndex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              justifyContent: "flex-start",
                              overflow: "hidden",
                              borderRadius: 1,
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              opacity: isMoving ? 0.55 : 1,
                              p: 0.75,
                              textAlign: "left",
                              transition: (theme) =>
                                theme.transitions.create("opacity"),
                              "&:hover": {
                                bgcolor: "primary.dark",
                              },
                              "&:focus-visible": {
                                outline: 2,
                                outlineColor: "secondary.main",
                                outlineOffset: 2,
                              },
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "inherit",
                                fontWeight: 700,
                                lineHeight: 1.2,
                              }}
                            >
                              {startLabel} - {endLabel}
                            </Typography>
                          </ButtonBase>
                        </Tooltip>
                      );
                    })}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
