import type {
  FieldPath,
  FieldValues,
  UseFormSetError,
} from "react-hook-form";
import type { ApiFieldErrors } from "@/types/api";

export function applyApiFieldErrors<TFields extends FieldValues>(
  fieldErrors: ApiFieldErrors,
  setError: UseFormSetError<TFields>,
  allowedFields: readonly FieldPath<TFields>[],
): boolean {
  let appliedError = false;

  for (const field of allowedFields) {
    const messages = fieldErrors[field];

    if (!messages?.length) {
      continue;
    }

    setError(field, {
      type: "server",
      message: messages[0],
      types: Object.fromEntries(
        messages.map((message, index) => [`server.${index}`, message]),
      ),
    });
    appliedError = true;
  }

  return appliedError;
}
