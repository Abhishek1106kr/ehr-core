"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AutomationJobsTable } from "@/components/shared/automation-jobs-table";
import { Button } from "@/components/ui/button";
import { RunWorkflowDialog } from "@/components/shared/run-workflow-dialog";

export default function AutomationPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Automation"
        description="Live workflow timeline for registration, booking, and verification jobs — pending, running, success, failed, retrying."
        actions={
          <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2">
            <Play className="h-4 w-4" />
            Run Demo Workflow
          </Button>
        }
      />
      <AutomationJobsTable emptyHint="Run a demo workflow above, or book/verify through the app, to see the step-by-step execution timeline here." />
      <RunWorkflowDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
