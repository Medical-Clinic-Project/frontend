"use client";

import { useMemo, type DragEvent } from "react";
import { Grid, Paper, Stack, Tooltip, Typography } from "@mui/material";
import {
  DOCTOR_AVAILABILITY_CALENDAR_TIME_GUTTER_WIDTH,
  DOCTOR_AVAILABILITY_DRAG_DATA_TYPE,
} from "@/constants/doctorAvailability";
import type {
  AvailabilityCalendarInteraction,
  DoctorAvailability,
} from "@/types/doctorAvailability";
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

export interface AvailabilityCalendarCopy {
  hint: string;
  time: string;
  slotLabel: (start: string, end: string) => string;
  slotTooltip: (start: string, end: string) => string;
}

interface AvailabilityCalendarProps {
  availability: readonly DoctorAvailability[];
  days: readonly Date[];
  viewMode: AvailabilityViewMode;
  interaction?: AvailabilityCalendarInteraction;
  copy?: AvailabilityCalendarCopy;
  movingAvailabilityId?: number | null;
  onSelect: (availability: DoctorAvailability) => void;
  onMove?: (
    availability: DoctorAvailability,
    newStart: Date,
  ) => void | Promise<void>;
  isSlotSelectable?: (availability: DoctorAvailability) => boolean;
}

export function AvailabilityCalendar({
  availability,
  days,
  viewMode,
  interaction = "manage",
  copy,
  movingAvailabilityId = null,
  onSelect,
  onMove,
  isSlotSelectable = () => true,
}: AvailabilityCalendarProps) {
  const calendarCopy =
    copy ??
    {
      hint: DOCTOR_AVAILABILITY_TEXT.calendar.dragHint,
      time: DOCTOR_AVAILABILITY_TEXT.calendar.time,
      slotLabel: DOCTOR_AVAILABILITY_TEXT.calendar.slotLabel,
      slotTooltip: DOCTOR_AVAILABILITY_TEXT.calendar.slotTooltip,
    };
  const canManageSlots = interaction === "manage";
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

    if (!slot || movingAvailabilityId !== null || !onMove) {
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
          {calendarCopy.hint}
        </Typography>

        <CalendarScrollArea>
          <CalendarViewport minimumWidth={calendarLayout.minimumWidth}>
            <CalendarHeaderGrid container wrap="nowrap">
              <Grid
                size="auto"
                sx={{ width: DOCTOR_AVAILABILITY_CALENDAR_TIME_GUTTER_WIDTH }}
              >
                <CalendarHeaderCell>
                  <Typography variant="caption" color="text.secondary">
                    {calendarCopy.time}
                  </Typography>
                </CalendarHeaderCell>
              </Grid>
              <Grid container size="grow" columns={days.length} wrap="nowrap">
                {days.map((day) => (
                  <Grid key={day.toISOString()} size={1}>
                    <CalendarDayHeaderCell>
                      <Typography
                        variant={viewMode === "day" ? "body1" : "body2"}
                      >
                        {formatDayHeader(day)}
                      </Typography>
                    </CalendarDayHeaderCell>
                  </Grid>
                ))}
              </Grid>
            </CalendarHeaderGrid>

            <CalendarBodyGrid
              container
              wrap="nowrap"
              calendarHeight={calendarLayout.calendarHeight}
            >
              <CalendarTimeGutter size="auto">
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

              <Grid container size="grow" columns={days.length} wrap="nowrap">
                {days.map((day, dayIndex) => (
                  <CalendarDayColumn
                    key={day.toISOString()}
                    size={1}
                    onDragOver={(event) => {
                      if (canManageSlots && movingAvailabilityId === null) {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                      }
                    }}
                    onDrop={
                      canManageSlots
                        ? (event) => handleDrop(event, day)
                        : undefined
                    }
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
                      const isSelectable = isSlotSelectable(segment.availability);
                      const isDisabled = isMoving || !isSelectable;

                      return (
                        <Tooltip
                          key={`${segment.availability.id}-${dayIndex}`}
                          title={calendarCopy.slotTooltip(
                            startLabel,
                            endLabel,
                          )}
                          arrow
                        >
                          <AvailabilitySegmentButton
                            draggable={canManageSlots && !isMoving}
                            disabled={isDisabled}
                            aria-label={calendarCopy.slotLabel(
                              startLabel,
                              endLabel,
                            )}
                            isMoving={isMoving}
                            segmentHeight={height}
                            segmentTop={top}
                            onClick={() => {
                              if (!isDisabled) {
                                onSelect(segment.availability);
                              }
                            }}
                            onDragStart={(event) => {
                              if (!canManageSlots) {
                                return;
                              }

                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData(
                                DOCTOR_AVAILABILITY_DRAG_DATA_TYPE,
                                segment.availability.id.toString(),
                              );
                            }}
                          >
                            <Typography variant="caption" color="inherit">
                              {calendarCopy.slotTooltip(
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
              </Grid>
            </CalendarBodyGrid>
          </CalendarViewport>
        </CalendarScrollArea>
      </Stack>
    </Paper>
  );
}
