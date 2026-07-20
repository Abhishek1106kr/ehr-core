import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "destructive";
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            tone === "default" && "bg-accent text-accent-foreground",
            tone === "success" && "bg-success/15 text-success",
            tone === "warning" && "bg-warning/20 text-warning-foreground",
            tone === "destructive" && "bg-destructive/10 text-destructive",
          )}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
