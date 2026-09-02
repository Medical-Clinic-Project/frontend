import { apiClient } from "@/api/apiClient";
import { APPOINTMENT_ENDPOINTS } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  appointmentSchema,
  appointmentsSchema,
  type Appointment,
  type CreateAppointmentRequest,
  type RescheduleAppointmentRequest,
  type UpdateAppointmentStatusRequest,
} from "@/types/appointment";

function validateAppointment(value: unknown): Appointment {
  const result = appointmentSchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return result.data;
}

function validateAppointments(value: unknown): Appointment[] {
  const result = appointmentsSchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return result.data;
}

export async function getMyAppointments(
  signal?: AbortSignal,
): Promise<Appointment[]> {
  const response = await apiClient.get<unknown>(APPOINTMENT_ENDPOINTS.mine, {
    signal,
  });

  return validateAppointments(response);
}

export async function getTodayAppointments(
  signal?: AbortSignal,
): Promise<Appointment[]> {
  const response = await apiClient.get<unknown>(APPOINTMENT_ENDPOINTS.today, {
    signal,
  });

  return validateAppointments(response);
}

export async function getUpcomingAppointments(
  signal?: AbortSignal,
): Promise<Appointment[]> {
  const response = await apiClient.get<unknown>(APPOINTMENT_ENDPOINTS.upcoming, {
    signal,
  });

  return validateAppointments(response);
}

export async function getCompletedAppointments(
  signal?: AbortSignal,
): Promise<Appointment[]> {
  const response = await apiClient.get<unknown>(APPOINTMENT_ENDPOINTS.completed, {
    signal,
  });

  return validateAppointments(response);
}

export async function getCancelledAppointments(
  signal?: AbortSignal,
): Promise<Appointment[]> {
  const response = await apiClient.get<unknown>(APPOINTMENT_ENDPOINTS.cancelled, {
    signal,
  });

  return validateAppointments(response);
}

export async function getAppointmentById(
  id: number,
  signal?: AbortSignal,
): Promise<Appointment> {
  const response = await apiClient.get<unknown>(APPOINTMENT_ENDPOINTS.byId(id), {
    signal,
  });

  return validateAppointment(response);
}

export async function createAppointment(
  request: CreateAppointmentRequest,
): Promise<Appointment> {
  const response = await apiClient.post<unknown>(
    APPOINTMENT_ENDPOINTS.root,
    request,
  );

  return validateAppointment(response);
}

export async function cancelAppointment(id: number): Promise<Appointment> {
  const response = await apiClient.patch<unknown>(
    APPOINTMENT_ENDPOINTS.cancel(id),
  );

  return validateAppointment(response);
}

export async function rescheduleAppointment(
  id: number,
  request: RescheduleAppointmentRequest,
): Promise<Appointment> {
  const response = await apiClient.put<unknown>(
    APPOINTMENT_ENDPOINTS.reschedule(id),
    request,
  );

  return validateAppointment(response);
}

export async function updateAppointmentStatus(
  id: number,
  request: UpdateAppointmentStatusRequest,
): Promise<Appointment> {
  const response = await apiClient.patch<unknown>(
    APPOINTMENT_ENDPOINTS.status(id),
    request,
  );

  return validateAppointment(response);
}
