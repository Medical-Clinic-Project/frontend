export const PASSWORD_TEXT = {
  accessibility: {
    requirementsLabel: "Password requirements",
  },
  requirements: {
    minimumLength: "At least 8 characters",
    uppercase: "One uppercase letter",
    lowercase: "One lowercase letter",
    number: "One number",
    specialCharacter: "One special character",
  },
  validation: {
    passwordRequired: "Password is required.",
    passwordRequirements: "Password does not meet all requirements.",
    passwordMaximum: "Password cannot exceed 100 characters.",
    confirmPasswordRequired: "Please confirm your password.",
    passwordsMismatch: "Passwords do not match.",
  },
} as const;
