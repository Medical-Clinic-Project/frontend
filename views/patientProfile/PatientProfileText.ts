export const PATIENT_PROFILE_TEXT = {
  metadataTitle: "My profile",
  eyebrow: "Patient workspace",
  title: "My profile",
  subtitle: "Review your account details and keep your basic information up to date.",
  loading: "Loading your profile…",
  retry: "Try again",
  form: {
    title: "Profile details",
    description: "You can update your name and email address.",
    fullNameLabel: "Full name",
    emailLabel: "Email address",
    statusLabel: "Account status",
    save: "Save changes",
  },
  status: {
    active: "Active",
    inactive: "Inactive",
  },
  validation: {
    fullNameRequired: "Full name is required.",
    fullNameMinimum: "Full name must be at least 2 characters.",
    fullNameMaximum: "Full name must be 100 characters or fewer.",
    emailRequired: "Email address is required.",
    emailInvalid: "Enter a valid email address.",
    emailMaximum: "Email address must be 150 characters or fewer.",
  },
  errors: {
    load: "Unable to load your profile. Please try again.",
    unavailable: "Your profile is unavailable. Please try again.",
    save: "Unable to update your profile. Please try again.",
  },
  feedback: {
    updated: "Your profile was updated successfully.",
  },
} as const;
