import { Box, ButtonBase, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DOCTOR_AVAILABILITY_CALENDAR_HEADER_HEIGHT,
  DOCTOR_AVAILABILITY_CALENDAR_HOUR_HEIGHT,
  DOCTOR_AVAILABILITY_CALENDAR_TIME_GUTTER_WIDTH,
} from "@/constants/doctorAvailability";

interface CalendarViewportProps {
  minimumWidth: number;
}

interface CalendarBodyGridProps {
  calendarHeight: number;
}

interface CalendarTimeLabelProps {
  markerPosition: number;
}

interface AvailabilitySegmentButtonProps {
  segmentHeight: number;
  segmentTop: number;
  isMoving: boolean;
}

export const CalendarScrollArea = styled(Box)({
  overflowX: "auto",
});

export const CalendarViewport = styled(Box, {
  shouldForwardProp: (prop) => prop !== "minimumWidth",
})<CalendarViewportProps>(({ minimumWidth }) => ({
  minWidth: minimumWidth,
}));

export const CalendarHeaderGrid = styled(Grid)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const CalendarHeaderCell = styled(Stack)({
  minHeight: DOCTOR_AVAILABILITY_CALENDAR_HEADER_HEIGHT,
  alignItems: "center",
  justifyContent: "center",
});

export const CalendarDayHeaderCell = styled(CalendarHeaderCell)(({ theme }) => ({
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

export const CalendarBodyGrid = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "calendarHeight",
})<CalendarBodyGridProps>(({ calendarHeight }) => ({
  height: calendarHeight,
}));

export const CalendarTimeGutter = styled(Grid)({
  position: "relative",
  width: DOCTOR_AVAILABILITY_CALENDAR_TIME_GUTTER_WIDTH,
  height: "100%",
});

export const CalendarTimeLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "markerPosition",
})<CalendarTimeLabelProps>(({ markerPosition, theme }) => ({
  position: "absolute",
  insetInline: 0,
  top: markerPosition,
  paddingInline: theme.spacing(1),
  transform: "translateY(-50%)",
  textAlign: "center",
}));

export const CalendarDayColumn = styled(Grid)(({ theme }) => {
  const halfHourHeight = DOCTOR_AVAILABILITY_CALENDAR_HOUR_HEIGHT / 2;

  return {
    position: "relative",
    height: "100%",
    borderLeft: `1px solid ${theme.palette.divider}`,
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${
      halfHourHeight - 1
    }px, ${theme.palette.divider} ${halfHourHeight - 1}px, ${
      theme.palette.divider
    } ${halfHourHeight}px)`,
  };
});

export const AvailabilitySegmentButton = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    prop !== "isMoving" &&
    prop !== "segmentHeight" &&
    prop !== "segmentTop",
})<AvailabilitySegmentButtonProps>(
  ({ isMoving, segmentHeight, segmentTop, theme }) => ({
    position: "absolute",
    top: segmentTop,
    insetInline: theme.spacing(0.5),
    zIndex: 1,
    height: segmentHeight,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    overflow: "hidden",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    opacity: isMoving ? 0.55 : 1,
    padding: theme.spacing(0.75),
    textAlign: "left",
  }),
);
