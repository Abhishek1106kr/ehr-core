"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppointments } from "@/lib/queries/appointments";

const STATUS_OPTIONS = [
  "ALL",
  "REQUESTED",
  "CONFIRMED",
  "RESCHEDULED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
];

export default function AppointmentsPage() {
  const [status, setStatus] = useState("ALL");
  const { data, isLoading } = useAppointments({ status: status === "ALL" ? undefined : status });

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Every booking across FHIR and browser-automation integration paths."
        actions={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "ALL" ? "All statuses" : s.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          icon={CalendarClock}
          title="No appointments found"
          description="Appointments booked via the AI Assistant or front desk will appear here."
        />
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booked Via</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.patient.name}</TableCell>
                  <TableCell>
                    {appt.doctor.name}
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      ({appt.doctor.specialty})
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(appt.startsAt), "MMM d, yyyy · h:mm a")}
                    {appt.isUrgent && (
                      <Badge
                        variant="outline"
                        className="ml-2 border-destructive/30 text-destructive"
                      >
                        Urgent
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={appt.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {appt.integrationMode?.replaceAll("_", " ") ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
