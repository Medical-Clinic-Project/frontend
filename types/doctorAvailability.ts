import { z } from "zod";

export const doctorAvailabilitySchema = z.object({
  id: z.number().int().positive(),
  doctorId: z.number().int().positive(),
  startTime: z.string().datetime({ offset: true }),
  endTime: z.string().datetime({ offset: true }),
});

export const doctorAvailabilitiesSchema = z.array(
  doctorAvailabilitySchema,
);

export type DoctorAvailability = z.infer<
  typeof doctorAvailabilitySchema
>;

export interface DoctorAvailabilityRange {
  from: string;
  to: string;
}

export interface DoctorAvailabilityRequest {
  startTime: string;
  endTime: string;
}
