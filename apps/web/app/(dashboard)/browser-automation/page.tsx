"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AutomationJobsTable } from "@/components/shared/automation-jobs-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RunWorkflowDialog } from "@/components/shared/run-workflow-dialog";

export default function BrowserAutomationPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Browser Automation"
        description="Playwright-driven fallback against MediTrack, a simulated legacy hospital portal with no API of its own."
        actions={
          <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2">
            <Play className="h-4 w-4" />
            Run Browser Automation Demo
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Every run here drives a real headless Chromium browser against{" "}
          <code className="rounded bg-muted px-1 py-0.5">/legacy-portal</code>: it logs in, searches
          for the patient, submits the booking form, and reads back the confirmation number —
          screenshotting each step. Open any row below to see the full timeline with screenshots.
        </CardContent>
      </Card>

      <AutomationJobsTable
        integrationMode="BROWSER_AUTOMATION"
        emptyHint="Run the demo above to see Playwright drive the legacy portal, screenshot by screenshot."
      />

      <RunWorkflowDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        forcedIntegrationMode="BROWSER_AUTOMATION"
      />
    </div>
  );
}
