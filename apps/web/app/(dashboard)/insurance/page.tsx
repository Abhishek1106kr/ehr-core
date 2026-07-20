import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function InsurancePage() {
  return (
    <div>
      <PageHeader
        title="Insurance"
        description="Coverage and verification status, viewed per patient."
      />
      <EmptyState
        icon={ShieldCheck}
        title="Select a patient to view insurance"
        description="Insurance policies and verification history are managed from each patient's record."
        action={
          <Button asChild>
            <Link href="/patients">Go to Patients</Link>
          </Button>
        }
      />
    </div>
  );
}
