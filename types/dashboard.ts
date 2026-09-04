import { z } from "zod";
import { appointmentStatusSchema } from "@/types/appointment";

const dashboardCountSchema = z.number().int().nonnegative();

export const dashboardStatusCountSchema = z.object({
  status: appointmentStatusSchema,
  count: dashboardCountSchema,
});

export const dashboardTimeSeriesPointSchema = z.object({
  date: z.string().datetime({ offset: true }),
  appointmentCount: dashboardCountSchema,
});

export const dashboardDepartmentCountSchema = z.object({
  departmentId: z.number().int().positive(),
  departmentName: z.string(),
  appointmentCount: dashboardCountSchema,
});

export const adminDashboardTotalsSchema = z.object({
  totalPatients: dashboardCountSchema,
  totalDoctors: dashboardCountSchema,
  totalDepartments: dashboardCountSchema,
  totalAppointments: dashboardCountSchema,
});

export const adminDashboardSchema = z.object({
  totals: adminDashboardTotalsSchema,
  appointmentsByStatus: z.array(dashboardStatusCountSchema),
  appointmentsByDepartment: z.array(dashboardDepartmentCountSchema),
  appointmentsOverTime: z.array(dashboardTimeSeriesPointSchema),
});

export const doctorDashboardSummarySchema = z.object({
  todayAppointments: dashboardCountSchema,
  upcomingAppointments: dashboardCountSchema,
  completedAppointments: dashboardCountSchema,
  cancelledAppointments: dashboardCountSchema,
});

export const doctorDashboardSchema = z.object({
  summary: doctorDashboardSummarySchema,
  appointmentsByStatus: z.array(dashboardStatusCountSchema),
  appointmentsByDay: z.array(dashboardTimeSeriesPointSchema),
  appointmentsOverTime: z.array(dashboardTimeSeriesPointSchema),
});

export type DashboardStatusCount = z.infer<typeof dashboardStatusCountSchema>;
export type DashboardTimeSeriesPoint = z.infer<
  typeof dashboardTimeSeriesPointSchema
>;
export type DashboardDepartmentCount = z.infer<
  typeof dashboardDepartmentCountSchema
>;
export type AdminDashboardTotals = z.infer<typeof adminDashboardTotalsSchema>;
export type AdminDashboard = z.infer<typeof adminDashboardSchema>;
export type DoctorDashboardSummary = z.infer<
  typeof doctorDashboardSummarySchema
>;
export type DoctorDashboard = z.infer<typeof doctorDashboardSchema>;
