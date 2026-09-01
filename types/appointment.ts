import { z } from "zod";
import { APPOINTMENT_STATUS_VALUES } from "@/constants/appointments";

export const appointmentStatusSchema = z.enum(APPOINTMENT_STATUS_VALUES);

export const appointmentSchema = z.object({
  id: z.number().int().positive(),
  patientId: z.number().int().positive(),
  patientName: z.string(),
  doctorId: z.number().int().positive(),
  doctorName: z.string(),
  departmentId: z.number().int().positive(),
  departmentName: z.string(),
  startTime: z.string().datetime({ offset: true }),
  endTime: z.string().datetime({ offset: true }),
  status: appointmentStatusSchema,
  reason: z.string().nullable(),
  notes: z.string().nullable(),
});

export const appointmentsSchema = z.array(appointmentSchema);

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;

export interface CreateAppointmentRequest {
  doctorId: number;
  startTime: string;
  endTime: string;
  reason: string | null;
  notes: string | null;
}

export interface RescheduleAppointmentRequest {
  startTime: string;
  endTime: string;
}
