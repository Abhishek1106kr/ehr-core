import { Bot } from "lucide-react";
import { PhaseTwoPlaceholder } from "@/components/shared/phase-two-placeholder";

export default function AssistantPage() {
  return (
    <PhaseTwoPlaceholder
      icon={Bot}
      title="AI Assistant"
      description="Conversational workflow automation for registration, booking, and lookups."
      detail="The conversation panel, intent extraction, and function-calling agent land once the automation engine (Phase 2) is wired to real workflows."
    />
  );
}
