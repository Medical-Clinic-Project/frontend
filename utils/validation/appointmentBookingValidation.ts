import { z } from "zod";
import {
  APPOINTMENT_NOTES_MAX_LENGTH,
  APPOINTMENT_REASON_MAX_LENGTH,
} from "@/constants/appointments";
import { APPOINTMENT_BOOKING_DIALOG_TEXT } from "@/components/dialogs/AppointmentBookingDialogText";

export const appointmentBookingFormSchema = z.object({
  reason: z.string().max(
    APPOINTMENT_REASON_MAX_LENGTH,
    APPOINTMENT_BOOKING_DIALOG_TEXT.validation.reasonMaximum,
  ),
  notes: z.string().max(
    APPOINTMENT_NOTES_MAX_LENGTH,
    APPOINTMENT_BOOKING_DIALOG_TEXT.validation.notesMaximum,
  ),
});

export type AppointmentBookingFormValues = z.infer<
  typeof appointmentBookingFormSchema
>;

export const EMPTY_APPOINTMENT_BOOKING_FORM_VALUES: AppointmentBookingFormValues = {
  reason: "",
  notes: "",
};
