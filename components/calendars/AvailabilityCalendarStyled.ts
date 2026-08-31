import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DOCTOR_AVAILABILITY_CALENDAR_HEADER_HEIGHT,
  DOCTOR_AVAILABILITY_CALENDAR_HOUR_HEIGHT,
} from "@/constants/doctorAvailability";

interface CalendarGridProps {
  gridTemplateColumns: string;
}

interface CalendarViewportProps {
  minimumWidth: number;
}

interface CalendarBodyGridProps extends CalendarGridProps {
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

export const CalendarHeaderGrid = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "gridTemplateColumns",
})<CalendarGridProps>(({ gridTemplateColumns, theme }) => ({
  display: "grid",
  gridTemplateColumns,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const CalendarHeaderCell = styled(Box)({
  display: "flex",
  minHeight: DOCTOR_AVAILABILITY_CALENDAR_HEADER_HEIGHT,
  alignItems: "center",
  justifyContent: "center",
});

export const CalendarDayHeaderCell = styled(CalendarHeaderCell)(({ theme }) => ({
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

export const CalendarBodyGrid = styled(Grid, {
  shouldForwardProp: (prop) =>
    prop !== "calendarHeight" && prop !== "gridTemplateColumns",
})<CalendarBodyGridProps>(({ calendarHeight, gridTemplateColumns }) => ({
  display: "grid",
  gridTemplateColumns,
  height: calendarHeight,
}));

export const CalendarTimeGutter = styled(Box)({
  position: "relative",
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

export const CalendarDayColumn = styled(Box)(({ theme }) => {
  const halfHourHeight = DOCTOR_AVAILABILITY_CALENDAR_HOUR_HEIGHT / 2;

  return {
    position: "relative",
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
    display: "flex",
    height: segmentHeight,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    opacity: isMoving ? 0.55 : 1,
    padding: theme.spacing(0.75),
    textAlign: "left",
  }),
);
