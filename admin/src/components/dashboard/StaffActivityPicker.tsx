import { cn } from "../../lib/cn";
import type { TraceableStaffMember } from "../../types/activity";

type StaffActivityPickerProps = {
  staff: TraceableStaffMember[];
  selectedActorId: string | null;
  onSelect: (actorId: string | null) => void;
  isLoading?: boolean;
};

function displayName(member: TraceableStaffMember): string {
  return member.name?.trim() || member.email?.trim() || "Unnamed staff";
}

function roleLabel(role: TraceableStaffMember["role"]): string {
  return role === "SUPPORT" ? "Support" : "Editor";
}

export function StaffActivityPicker({
  staff,
  selectedActorId,
  onSelect,
  isLoading = false,
}: StaffActivityPickerProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-32 animate-pulse rounded-full bg-surface-container-high"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-label-sm font-medium transition-colors",
          selectedActorId === null
            ? "border-primary bg-primary-container/15 text-primary"
            : "border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:border-primary/40 hover:text-on-surface",
        )}
      >
        All activity
      </button>

      {staff.map((member) => {
        const isSelected = selectedActorId === member.id;

        return (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelect(member.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-label-sm font-medium transition-colors",
              isSelected
                ? "border-primary bg-primary-container/15 text-primary"
                : "border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:border-primary/40 hover:text-on-surface",
            )}
          >
            <span>{displayName(member)}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                member.role === "SUPPORT"
                  ? "bg-tertiary-fixed/50 text-on-tertiary-fixed-variant"
                  : "bg-secondary-fixed/40 text-secondary-container",
              )}
            >
              {roleLabel(member.role)}
            </span>
            <span className="rounded-full bg-surface-container-highest px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant">
              {member.activityCount}
            </span>
          </button>
        );
      })}

      {staff.length === 0 ? (
        <p className="self-center text-body-sm text-on-surface-variant">
          No support or editor staff accounts found.
        </p>
      ) : null}
    </div>
  );
}
