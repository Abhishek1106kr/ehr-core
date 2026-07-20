"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatients } from "@/lib/queries/patients";
import { useDoctors } from "@/lib/queries/doctors";
import { useEnqueueAppointmentBookingWorkflow } from "@/lib/queries/workflows";
import { useOrganizationId } from "@/hooks/use-organization";
import { ApiRequestError } from "@/lib/api-client";
import type { IntegrationMode } from "@openehr-bridge/shared";

export function RunWorkflowDialog({
  open,
  onOpenChange,
  forcedIntegrationMode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Lock the demo to one integration path — used by the Browser Automation page. */
  forcedIntegrationMode?: IntegrationMode;
}) {
  const organizationId = useOrganizationId();
  const { data: patients } = usePatients({ organizationId, page: 1 });
  const { data: doctors } = useDoctors({ organizationId });
  const enqueue = useEnqueueAppointmentBookingWorkflow();
  const router = useRouter();

  const [patientId, setPatientId] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [integrationMode, setIntegrationMode] = useState<IntegrationMode>(
    forcedIntegrationMode ?? "BROWSER_AUTOMATION",
  );

  async function onSubmit() {
    if (!organizationId || !patientId || !doctorId) return;

    const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    startsAt.setMinutes(0, 0, 0);
    const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);

    try {
      const job = await enqueue.mutateAsync({
        organizationId,
        patientId,
        doctorId,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        integrationMode: forcedIntegrationMode ?? integrationMode,
      });
      toast.success("Workflow enqueued", {
        description:
          "Booking appointment via " +
          (forcedIntegrationMode ?? integrationMode).replaceAll("_", " "),
      });
      onOpenChange(false);
      router.push(`/automation/${job.id}`);
    } catch (err) {
      toast.error("Could not enqueue workflow", {
        description: err instanceof ApiRequestError ? err.message : "Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run appointment booking workflow</DialogTitle>
          <DialogDescription>
            Enqueues a real workflow job — watch it progress step by step on the next screen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Patient</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients?.items.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.mrn})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Doctor</Label>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors?.items.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!forcedIntegrationMode && (
            <div className="space-y-2">
              <Label>Integration path</Label>
              <Select
                value={integrationMode}
                onValueChange={(v: string) => setIntegrationMode(v as IntegrationMode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FHIR_REST">FHIR REST</SelectItem>
                  <SelectItem value="BROWSER_AUTOMATION">Browser Automation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!patientId || !doctorId || enqueue.isPending}>
            {enqueue.isPending ? "Enqueuing…" : "Run workflow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
