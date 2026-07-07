import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { QUICK_ACTIONS } from "@/constants/navigation";

export function QuickActionsSection() {
  return (
    <SectionCard title="Quick actions" description="Jump straight into your next task.">
      <div className="grid gap-3 sm:grid-cols-2">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard
            key={action.href + action.label}
            label={action.label}
            href={action.href}
            icon={action.icon}
            enabled={action.enabled}
          />
        ))}
      </div>
    </SectionCard>
  );
}
