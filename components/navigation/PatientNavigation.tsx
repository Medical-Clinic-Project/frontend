import { RoleNavigation } from "@/components/navigation/RoleNavigation";
import {
  PATIENT_NAVIGATION_ITEMS,
  PATIENT_NAVIGATION_TEXT,
} from "@/constants/navigation";

export function PatientNavigation() {
  return (
    <RoleNavigation
      brand={PATIENT_NAVIGATION_TEXT.brand}
      section={PATIENT_NAVIGATION_TEXT.section}
      ariaLabel={PATIENT_NAVIGATION_TEXT.ariaLabel}
      items={PATIENT_NAVIGATION_ITEMS}
    />
  );
}
