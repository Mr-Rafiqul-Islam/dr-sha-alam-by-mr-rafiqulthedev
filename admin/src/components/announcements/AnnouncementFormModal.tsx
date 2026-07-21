import { useState } from "react";
import { Button, Input, Modal } from "../common";
import type { Announcement, AnnouncementFormValues } from "../../types/announcement";
import {
  announcementToFormValues,
  getDefaultAnnouncementFormValues,
} from "../../utils/announcement";

type AnnouncementFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AnnouncementFormValues) => Promise<void>;
  initialAnnouncement?: Announcement | null;
  isSubmitting?: boolean;
};

const TYPE_OPTIONS = [
  { value: "INFO", label: "Info" },
  { value: "WARNING", label: "Warning" },
  { value: "URGENT", label: "Urgent" },
] as const;

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
] as const;

function getFormValuesForModal(
  initialAnnouncement?: Announcement | null,
): AnnouncementFormValues {
  return initialAnnouncement
    ? announcementToFormValues(initialAnnouncement)
    : getDefaultAnnouncementFormValues();
}

export function AnnouncementFormModal({
  open,
  onClose,
  onSubmit,
  initialAnnouncement,
  isSubmitting = false,
}: AnnouncementFormModalProps) {
  const isEditing = Boolean(initialAnnouncement);
  const openFormKey = open ? (initialAnnouncement?.id ?? "new") : null;
  const [values, setValues] = useState(getDefaultAnnouncementFormValues);
  const [appliedFormKey, setAppliedFormKey] = useState<string | null>(null);

  if (openFormKey !== null && appliedFormKey !== openFormKey) {
    setAppliedFormKey(openFormKey);
    setValues(getFormValuesForModal(initialAnnouncement));
  }

  if (openFormKey === null && appliedFormKey !== null) {
    setAppliedFormKey(null);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Announcement" : "Create Announcement"}
      subtitle={
        isEditing
          ? "Update the announcement. Set status to Inactive to hide it from staff."
          : "Active announcements stay visible in the notification bar until marked inactive."
      }
      className="max-w-4xl w-full"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-label-md text-on-surface-variant">
            Title
          </label>
          <Input
            value={values.title}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, title: event.target.value }))
            }
            required
            placeholder="Announcement title"
          />
        </div>

        <div>
          <label className="mb-1 block text-label-md text-on-surface-variant">
            Message
          </label>
          <textarea
            value={values.content}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, content: event.target.value }))
            }
            required
            rows={5}
            placeholder="Write the full announcement message..."
            className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-label-md text-on-surface-variant">
              Type
            </label>
            <select
              value={values.type}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  type: event.target.value as AnnouncementFormValues["type"],
                }))
              }
              className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-label-md text-on-surface-variant">
              Status
            </label>
            <select
              value={values.status}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  status: event.target.value as AnnouncementFormValues["status"],
                }))
              }
              className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create announcement"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
