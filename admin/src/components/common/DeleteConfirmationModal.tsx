import { Button } from "./Button";
import { Modal } from "./Modal";

type DeleteConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  description?: string;
  confirmLabel?: string;
  isLoading?: boolean;
};

export function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "Delete item?",
  itemName,
  description,
  confirmLabel = "Delete",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const bodyText =
    description ??
    (itemName
      ? `Are you sure you want to delete ${itemName}? This action cannot be undone.`
      : "Are you sure you want to delete this item? This action cannot be undone.");

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        <p className="text-body-md text-on-surface-variant">{bodyText}</p>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-error text-on-error hover:bg-error/90 shadow-sm hover:shadow-md"
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
