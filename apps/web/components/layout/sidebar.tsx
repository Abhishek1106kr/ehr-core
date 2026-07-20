"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, Cross } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-config";
import { useUiStore } from "@/store/ui-store";
import { useCurrentUser } from "@/lib/queries/auth";
import { hasPermission } from "@openehr-bridge/shared";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const { data } = useCurrentUser();
  const role = data?.user.role;

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.permission || (role && hasPermission(role, item.permission)),
  );

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-dvh flex-col border-r border-sidebar-border bg-sidebar transition-all",
        sidebarCollapsed ? "w-[68px]" : "w-64",
      )}
      aria-label="Primary navigation"
    >
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Cross className="h-4 w-4" aria-hidden />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">OpenEHR Bridge</p>
            <p className="truncate text-xs text-muted-foreground">Confido Health</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Sections">
        {visibleItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          const link = (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );

          if (!sidebarCollapsed) return link;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft
            className={cn(
              "h-[18px] w-[18px] transition-transform",
              sidebarCollapsed && "rotate-180",
            )}
          />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
