import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Stethoscope,
  ShieldCheck,
  Bot,
  Workflow,
  Database,
  MousePointerClick,
  ScrollText,
  Activity,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
  /** Permission required to see this item; omit for items visible to all authenticated roles. */
  permission?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "G D" },
  {
    label: "Patients",
    href: "/patients",
    icon: Users,
    shortcut: "G P",
    permission: "patients:read",
  },
  {
    label: "Appointments",
    href: "/appointments",
    icon: CalendarClock,
    shortcut: "G A",
    permission: "appointments:read",
  },
  { label: "Doctors", href: "/doctors", icon: Stethoscope, permission: "patients:read" },
  { label: "Insurance", href: "/insurance", icon: ShieldCheck, permission: "insurance:read" },
  { label: "AI Assistant", href: "/assistant", icon: Bot },
  { label: "Automation", href: "/automation", icon: Workflow, permission: "monitoring:read" },
  { label: "FHIR", href: "/fhir", icon: Database },
  { label: "Browser Automation", href: "/browser-automation", icon: MousePointerClick },
  { label: "Audit Logs", href: "/audit-logs", icon: ScrollText, permission: "audit:read" },
  { label: "Monitoring", href: "/monitoring", icon: Activity, permission: "monitoring:read" },
  { label: "Settings", href: "/settings", icon: Settings },
];
