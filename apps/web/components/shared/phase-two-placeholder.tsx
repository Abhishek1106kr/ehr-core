import type { LucideIcon } from "lucide-react";
import { PageHeader } from "./page-header";
import { EmptyState } from "./empty-state";

export function PhaseTwoPlaceholder({
  title,
  description,
  icon,
  detail,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  detail: string;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <EmptyState icon={icon} title="Coming in Phase 2" description={detail} />
    </div>
  );
}
