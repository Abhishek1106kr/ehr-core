"use client";

import { useState } from "react";
import { Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FHIR_RESOURCE_TYPES, useFhirResources, useSyncFhirResources } from "@/lib/queries/fhir";
import { useOrganizationId } from "@/hooks/use-organization";
import { ApiRequestError } from "@/lib/api-client";

export default function FhirPage() {
  const [resourceType, setResourceType] = useState<string>("Patient");
  const organizationId = useOrganizationId();
  const { data, isLoading } = useFhirResources(resourceType);
  const sync = useSyncFhirResources();

  async function onSync() {
    if (!organizationId) return;
    try {
      const result = await sync.mutateAsync(organizationId);
      toast.success(`Synced ${result.synced} FHIR resources`, {
        description: Object.entries(result.breakdown)
          .map(([type, count]) => `${type}: ${count}`)
          .join(" · "),
      });
    } catch (err) {
      toast.error("Sync failed", {
        description: err instanceof ApiRequestError ? err.message : "Please try again.",
      });
    }
  }

  return (
    <div>
      <PageHeader
        title="FHIR"
        description="Mock FHIR R4 resources generated from patient, doctor, appointment, and insurance records."
        actions={
          <Button onClick={onSync} disabled={sync.isPending} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${sync.isPending ? "animate-spin" : ""}`} />
            {sync.isPending ? "Syncing…" : "Sync from database"}
          </Button>
        }
      />

      <Tabs value={resourceType} onValueChange={setResourceType} className="mb-4">
        <TabsList className="flex-wrap">
          {FHIR_RESOURCE_TYPES.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          icon={Database}
          title={`No ${resourceType} resources yet`}
          description="Click “Sync from database” to generate FHIR resources from current records."
        />
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FHIR ID</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-mono text-xs">{resource.fhirId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">v{resource.version}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(resource.updatedAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="max-w-md truncate font-mono text-xs text-muted-foreground">
                    {JSON.stringify(resource.data)}
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
