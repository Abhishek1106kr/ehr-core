import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_TONES: Record<string, string> = {
  // Appointments
  CONFIRMED: "bg-success/15 text-success border-success/30",
  REQUESTED: "bg-accent text-accent-foreground border-accent",
  RESCHEDULED: "bg-warning/20 text-warning-foreground border-warning/40",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/30",
  COMPLETED: "bg-muted text-muted-foreground border-border",
  NO_SHOW: "bg-destructive/10 text-destructive border-destructive/30",
  // Verification / Insurance
  VERIFIED: "bg-success/15 text-success border-success/30",
  ACTIVE: "bg-success/15 text-success border-success/30",
  PENDING: "bg-warning/20 text-warning-foreground border-warning/40",
  UNVERIFIED: "bg-muted text-muted-foreground border-border",
  NOT_CHECKED: "bg-muted text-muted-foreground border-border",
  FAILED: "bg-destructive/10 text-destructive border-destructive/30",
  DENIED: "bg-destructive/10 text-destructive border-destructive/30",
  INACTIVE: "bg-destructive/10 text-destructive border-destructive/30",
  // Workflow / Automation
  RUNNING: "bg-accent text-accent-foreground border-accent",
  SUCCESS: "bg-success/15 text-success border-success/30",
  RETRYING: "bg-warning/20 text-warning-foreground border-warning/40",
  DEAD_LETTER: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium capitalize",
        STATUS_TONES[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status.replaceAll("_", " ").toLowerCase()}
    </Badge>
  );
}
