import { z } from "zod";

export const apiFieldErrorsSchema = z.record(z.string(), z.array(z.string()));

export const apiErrorResponseSchema = z.object({
  message: z.string().optional(),
  errors: apiFieldErrorsSchema.optional(),
});

export type ApiFieldErrors = z.infer<typeof apiFieldErrorsSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: ApiFieldErrors;

  constructor(status: number, message: string, fieldErrors: ApiFieldErrors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
