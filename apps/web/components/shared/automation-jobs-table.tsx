"use client";

import Link from "next/link";
import { Workflow } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAutomationJobs } from "@/lib/queries/automation-jobs";

export function AutomationJobsTable({
  emptyHint,
  integrationMode,
}: {
  emptyHint: string;
  integrationMode?: string;
}) {
  const { data, isLoading } = useAutomationJobs({ integrationMode });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!data?.items.length) {
    return <EmptyState icon={Workflow} title="No automation jobs yet" description={emptyHint} />;
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Integration</TableHead>
            <TableHead>Attempt</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Started</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((job) => (
            <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="p-0">
                <Link href={`/automation/${job.id}`} className="block px-4 py-3 font-medium">
                  {job.type.replaceAll("_", " ")}
                </Link>
              </TableCell>
              <TableCell>
                <StatusBadge status={job.status} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {job.integrationMode.replaceAll("_", " ")}
              </TableCell>
              <TableCell>
                {job.attempt} / {job.maxAttempts}
              </TableCell>
              <TableCell className="text-xs">
                {job.durationMs != null ? `${job.durationMs} ms` : "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {job.startedAt ? format(new Date(job.startedAt), "MMM d, HH:mm:ss") : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
