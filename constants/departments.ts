import type { DepartmentFormValues } from "@/utils/validation/departmentValidation";

export const DEPARTMENT_FORM_FIELDS = ["name", "description", "isActive"] as const satisfies readonly (
  keyof DepartmentFormValues
)[];

export const EMPTY_DEPARTMENT_FORM_VALUES: DepartmentFormValues = {
  name: "",
  description: "",
  isActive: true,
};

export const DEPARTMENT_GRID_FIELDS = {
  name: "name",
  description: "description",
  status: "isActive",
  actions: "actions",
} as const;

export const DEPARTMENT_GRID_COLUMN_WIDTHS = {
  name: 180,
  description: 280,
  status: 130,
  actions: 112,
} as const;
