import { useEffect, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import { Icon } from "./Icon";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-inverse-surface/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto",
          "rounded-xl border border-outline-variant/30 bg-surface-container-lowest",
          "shadow-[0_8px_32px_-8px_rgba(0,93,122,0.15)]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/30 px-6 py-4">
          <div>
            <h2
              id="modal-title"
              className="text-headline-md text-on-surface"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-body-md text-on-surface-variant">
                {subtitle}
              </p>
            ) : null}
          </div>
          <Button
            variant="icon"
            size="sm"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="close" size={20} />
          </Button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
