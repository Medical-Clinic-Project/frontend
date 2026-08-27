import { RoleNavigation } from "@/components/navigation/RoleNavigation";
import {
  DOCTOR_NAVIGATION_ITEMS,
  DOCTOR_NAVIGATION_TEXT,
} from "@/constants/navigation";

export function DoctorNavigation() {
  return (
    <RoleNavigation
      brand={DOCTOR_NAVIGATION_TEXT.brand}
      section={DOCTOR_NAVIGATION_TEXT.section}
      ariaLabel={DOCTOR_NAVIGATION_TEXT.ariaLabel}
      items={DOCTOR_NAVIGATION_ITEMS}
    />
  );
}
