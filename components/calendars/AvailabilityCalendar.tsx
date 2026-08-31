"use client";

import { useMemo, type DragEvent } from "react";
import { Paper, Stack, Tooltip, Typography } from "@mui/material";
import {
  DOCTOR_AVAILABILITY_DRAG_DATA_TYPE,
} from "@/constants/doctorAvailability";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import {
  getAvailabilityCalendarHourMarkers,
  getAvailabilityCalendarLayout,
  getAvailabilityCalendarSegments,
  getAvailabilityDropStart,
  getAvailabilitySegmentLayout,
  getAvailabilitySegmentTimeLabels,
  getAvailabilitySegmentsByDay,
  getCalendarDisplayHours,
} from "@/utils/doctorAvailability/calendar";
import {
  formatDayHeader,
  type AvailabilityViewMode,
} from "@/utils/doctorAvailability/dateTime";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityText";
import {
  AvailabilitySegmentButton,
  CalendarBodyGrid,
  CalendarDayColumn,
  CalendarDayHeaderCell,
  CalendarHeaderCell,
  CalendarHeaderGrid,
  CalendarScrollArea,
  CalendarTimeGutter,
  CalendarTimeLabel,
  CalendarViewport,
} from "./AvailabilityCalendarStyled";

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

export function AvailabilityCalendar({
  availability,
  days,
  viewMode,
  movingAvailabilityId,
  onSelect,
  onMove,
}: AvailabilityCalendarProps) {
  const segments = useMemo(
    () => getAvailabilityCalendarSegments(availability, days),
    [availability, days],
  );
  const { startHour, endHour } = useMemo(
    () => getCalendarDisplayHours(segments),
    [segments],
  );
  const calendarLayout = useMemo(
    () => getAvailabilityCalendarLayout(startHour, endHour, days.length),
    [days.length, endHour, startHour],
  );
  const hourMarkers = useMemo(
    () => getAvailabilityCalendarHourMarkers(startHour, endHour),
    [endHour, startHour],
  );
  const segmentsByDay = useMemo(
    () => getAvailabilitySegmentsByDay(segments, days.length),
    [days.length, segments],
  );

  const handleDrop = (event: DragEvent<HTMLElement>, day: Date) => {
    event.preventDefault();
    const availabilityId = Number(
      event.dataTransfer.getData(DOCTOR_AVAILABILITY_DRAG_DATA_TYPE),
    );
    const slot = availability.find((item) => item.id === availabilityId);

    if (!slot || movingAvailabilityId !== null) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const newStart = getAvailabilityDropStart(
      day,
      startHour,
      endHour,
      event.clientY - bounds.top,
      bounds.height,
    );

    void onMove(slot, newStart);
  };

  return (
    <Paper variant="outlined">
      <Stack spacing={1.5} sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Typography variant="body2" color="text.secondary">
          {DOCTOR_AVAILABILITY_TEXT.calendar.dragHint}
        </Typography>

        <CalendarScrollArea>
          <CalendarViewport minimumWidth={calendarLayout.minimumWidth}>
            <CalendarHeaderGrid
              gridTemplateColumns={calendarLayout.gridTemplateColumns}
            >
              <CalendarHeaderCell>
                <Typography variant="caption" color="text.secondary">
                  {DOCTOR_AVAILABILITY_TEXT.calendar.time}
                </Typography>
              </CalendarHeaderCell>
              {days.map((day) => (
                <CalendarDayHeaderCell key={day.toISOString()}>
                  <Typography
                    variant={viewMode === "day" ? "body1" : "body2"}
                  >
                    {formatDayHeader(day)}
                  </Typography>
                </CalendarDayHeaderCell>
              ))}
            </CalendarHeaderGrid>

            <CalendarBodyGrid
              calendarHeight={calendarLayout.calendarHeight}
              gridTemplateColumns={calendarLayout.gridTemplateColumns}
            >
              <CalendarTimeGutter>
                {hourMarkers.map((marker) => (
                  <CalendarTimeLabel
                    key={marker.hour}
                    variant="caption"
                    color="text.secondary"
                    markerPosition={marker.position}
                  >
                    {marker.label}
                  </CalendarTimeLabel>
                ))}
              </CalendarTimeGutter>

              {days.map((day, dayIndex) => (
                <CalendarDayColumn
                  key={day.toISOString()}
                  onDragOver={(event) => {
                    if (movingAvailabilityId === null) {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }
                  }}
                  onDrop={(event) => handleDrop(event, day)}
                >
                  {segmentsByDay[dayIndex].map((segment) => {
                    const { height, top } = getAvailabilitySegmentLayout(
                      segment,
                      startHour,
                    );
                    const { endLabel, startLabel } =
                      getAvailabilitySegmentTimeLabels(segment);
                    const isMoving =
                      movingAvailabilityId === segment.availability.id;

                    return (
                      <Tooltip
                        key={`${segment.availability.id}-${dayIndex}`}
                        title={DOCTOR_AVAILABILITY_TEXT.calendar.slotTooltip(
                          startLabel,
                          endLabel,
                        )}
                        arrow
                      >
                        <AvailabilitySegmentButton
                          draggable={!isMoving}
                          disabled={isMoving}
                          aria-label={DOCTOR_AVAILABILITY_TEXT.calendar.slotLabel(
                            startLabel,
                            endLabel,
                          )}
                          isMoving={isMoving}
                          segmentHeight={height}
                          segmentTop={top}
                          onClick={() => onSelect(segment.availability)}
                          onDragStart={(event) => {
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData(
                              DOCTOR_AVAILABILITY_DRAG_DATA_TYPE,
                              segment.availability.id.toString(),
                            );
                          }}
                        >
                          <Typography variant="caption" color="inherit">
                            {DOCTOR_AVAILABILITY_TEXT.calendar.slotTooltip(
                              startLabel,
                              endLabel,
                            )}
                          </Typography>
                        </AvailabilitySegmentButton>
                      </Tooltip>
                    );
                  })}
                </CalendarDayColumn>
              ))}
            </CalendarBodyGrid>
          </CalendarViewport>
        </CalendarScrollArea>
      </Stack>
    </Paper>
  );
}
