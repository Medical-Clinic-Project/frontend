import { apiClient } from "@/api/apiClient";
import { APPOINTMENT_ENDPOINTS } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  appointmentSchema,
  appointmentsSchema,
  type Appointment,
  type AppointmentQuery,
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

function getAppointmentsPath(query?: AppointmentQuery): string {
  const searchParams = new URLSearchParams();
  const normalizedSearch = query?.search?.trim();

  if (normalizedSearch) {
    searchParams.set("search", normalizedSearch);
  }

  if (query?.status) {
    searchParams.set("status", query.status);
  }

  for (const [name, value] of Object.entries({
    doctorId: query?.doctorId,
    patientId: query?.patientId,
    departmentId: query?.departmentId,
  })) {
    if (typeof value === "number" && Number.isInteger(value) && value > 0) {
      searchParams.set(name, value.toString());
    }
  }

  if (query?.from) {
    searchParams.set("from", query.from);
  }

  if (query?.to) {
    searchParams.set("to", query.to);
  }

  const queryString = searchParams.toString();
  return queryString
    ? `${APPOINTMENT_ENDPOINTS.root}?${queryString}`
    : APPOINTMENT_ENDPOINTS.root;
}

export async function getAllAppointments(
  query?: AppointmentQuery,
  signal?: AbortSignal,
): Promise<Appointment[]> {
  const response = await apiClient.get<unknown>(getAppointmentsPath(query), {
    signal,
  });

  return validateAppointments(response);
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
