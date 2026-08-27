import { z } from "zod";
import { parseLocalDateTimeInput } from "@/views/doctorAvailability/doctorAvailabilityDates";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityView.text";

export const doctorAvailabilityFormSchema = z
  .object({
    startTime: z.string().min(
      1,
      DOCTOR_AVAILABILITY_TEXT.validation.startTimeRequired,
    ),
    endTime: z.string().min(
      1,
      DOCTOR_AVAILABILITY_TEXT.validation.endTimeRequired,
    ),
  })
  .superRefine((values, context) => {
    const start = parseLocalDateTimeInput(values.startTime);
    const end = parseLocalDateTimeInput(values.endTime);

    if (!start) {
      context.addIssue({
        code: "custom",
        path: ["startTime"],
        message: DOCTOR_AVAILABILITY_TEXT.validation.invalidDateTime,
      });
      return;
    }

    if (!end) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: DOCTOR_AVAILABILITY_TEXT.validation.invalidDateTime,
      });
      return;
    }

    if (end <= start) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: DOCTOR_AVAILABILITY_TEXT.validation.endAfterStart,
      });
    }

    if (start < new Date()) {
      context.addIssue({
        code: "custom",
        path: ["startTime"],
        message: DOCTOR_AVAILABILITY_TEXT.validation.pastStart,
      });
    }
  });

export type DoctorAvailabilityFormValues = z.infer<
  typeof doctorAvailabilityFormSchema
>;
