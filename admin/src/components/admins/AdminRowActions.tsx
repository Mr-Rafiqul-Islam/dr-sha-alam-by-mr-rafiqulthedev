import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { Button, Icon } from "../common";
import { cn } from "../../lib/cn";
import type { AdminManagedUser } from "../../types/admin";
import { isAdminUserActive } from "../../utils/admin";

type AdminRowActionsProps = {
  user: AdminManagedUser;
  disabled?: boolean;
  onEdit: (user: AdminManagedUser) => void;
  onToggleActive: (user: AdminManagedUser) => void;
  onDelete: (user: AdminManagedUser) => void;
};

export function AdminRowActions({
  user,
  disabled = false,
  onEdit,
  onToggleActive,
  onDelete,
}: AdminRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const active = isAdminUserActive(user.active);

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 4,
        right: Math.max(8, window.innerWidth - rect.right),
        zIndex: 50,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (disabled) {
    return (
      <span className="text-label-sm text-on-surface-variant">—</span>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Open user actions"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon name="more_vert" size={20} />
      </Button>

      {open && menuStyle
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              style={menuStyle}
              className={cn(
                "min-w-44 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest py-1",
                "shadow-[0_8px_24px_-8px_rgba(0,93,122,0.18)]",
              )}
            >
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container-low"
                onClick={() => {
                  setOpen(false);
                  onEdit(user);
                }}
              >
                <Icon name="edit" size={18} />
                Edit user
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container-low"
                onClick={() => {
                  setOpen(false);
                  onToggleActive(user);
                }}
              >
                <Icon name={active ? "person_off" : "person"} size={18} />
                {active ? "Inactive user" : "Active user"}
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm text-error transition-colors hover:bg-error-container/40"
                onClick={() => {
                  setOpen(false);
                  onDelete(user);
                }}
              >
                <Icon name="delete" size={18} />
                Delete user
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
