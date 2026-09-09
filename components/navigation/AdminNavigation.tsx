"use client";

import { SidebarNavigation } from "@/components/navigation/SidebarNavigation";
import {
  ADMIN_NAVIGATION_ITEMS,
  ADMIN_NAVIGATION_TEXT,
} from "@/constants/navigation";

export function AdminNavigation() {
  return (
    <SidebarNavigation
      items={ADMIN_NAVIGATION_ITEMS}
      text={ADMIN_NAVIGATION_TEXT}
    />
  );
}
