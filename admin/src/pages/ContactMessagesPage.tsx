import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ContactMessageFilters } from "../components/contact/ContactMessageFilters";
import {
  Avatar,
  Badge,
  Button,
  DeleteConfirmationModal,
  Icon,
  Modal,
  PageHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/common";
import {
  useDeleteContactMessageMutation,
  useGetContactMessagesQuery,
  useUpdateContactMessageStatusMutation,
} from "../store/api/contactMessagesApi";
import type {
  ContactMessage,
  ContactMessageFilterState,
  ContactMessageStatus,
} from "../types/contact";
import {
  CONTACT_STATUS_OPTIONS,
  exportContactMessagesCsv,
  filterContactMessages,
  formatContactDate,
  formatContactTime,
  getApiErrorMessage,
  getInitials,
  getStatusBadgeVariant,
  getStatusLabel,
} from "../utils/contact";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: ContactMessageFilterState = {
  name: "",
  subject: "",
  status: "",
};

type ContactMessageActionsProps = {
  message: ContactMessage;
  onView: (message: ContactMessage) => void;
  onEdit: (message: ContactMessage) => void;
  onDelete: (message: ContactMessage) => void;
};

function ContactMessageActions({
  message,
  onView,
  onEdit,
  onDelete,
}: ContactMessageActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        aria-label="View contact message"
        onClick={() => onView(message)}
      >
        <Icon name="visibility" size={20} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Edit contact message status"
        onClick={() => onEdit(message)}
      >
        <Icon name="edit" size={20} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-error-container/50 hover:text-error"
        aria-label="Delete contact message"
        onClick={() => onDelete(message)}
      >
        <Icon name="delete" size={20} />
      </Button>
    </div>
  );
}

function ContactMessageCard({
  message,
  onView,
  onEdit,
  onDelete,
}: ContactMessageActionsProps) {
  return (
    <article className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar initials={getInitials(message.name)} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-body-md font-semibold text-on-surface">
              {message.name}
            </p>
            <p className="truncate text-label-sm text-on-surface-variant">
              {message.email ?? "—"}
            </p>
          </div>
        </div>
        <ContactMessageActions
          message={message}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant={getStatusBadgeVariant(message.status)}>
          {getStatusLabel(message.status)}
        </Badge>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <dt className="text-label-sm text-on-surface-variant">Phone</dt>
          <dd className="mt-0.5 text-body-sm text-on-surface">
            {message.phone}
          </dd>
        </div>
        <div>
          <dt className="text-label-sm text-on-surface-variant">Created</dt>
          <dd className="mt-0.5 text-body-sm text-on-surface">
            {formatContactDate(message.createdAt)}
          </dd>
          <dd className="text-label-sm text-on-surface-variant">
            {formatContactTime(message.createdAt)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-label-sm text-on-surface-variant">Subject</dt>
          <dd className="mt-0.5 wrap-break-word text-body-sm text-on-surface-variant">
            {message.subject}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function ContactMessagesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [draftFilters, setDraftFilters] =
    useState<ContactMessageFilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<ContactMessageFilterState>(DEFAULT_FILTERS);
  const [editingMessage, setEditingMessage] = useState<ContactMessage | null>(
    null,
  );
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<
    ContactMessageStatus | ""
  >("");

  const { data: messages = [], isLoading, isError, error } =
    useGetContactMessagesQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateContactMessageStatusMutation();
  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();

  const filteredMessages = useMemo(
    () => filterContactMessages(messages, appliedFilters),
    [messages, appliedFilters],
  );

  const totalItems = filteredMessages.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const effectivePage = Math.min(currentPage, totalPages);
  const paginatedMessages = filteredMessages.slice(
    (effectivePage - 1) * PAGE_SIZE,
    effectivePage * PAGE_SIZE,
  );

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, "Failed to load contact messages"));
    }
  }, [isError, error]);

  const openStatusModal = (message: ContactMessage) => {
    setEditingMessage(message);
    setSelectedStatus(message.status);
  };

  const closeStatusModal = () => {
    setEditingMessage(null);
    setSelectedStatus("");
  };

  const handleSearch = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async () => {
    if (!editingMessage || !selectedStatus) return;

    try {
      await updateStatus({
        id: editingMessage.id,
        status: selectedStatus,
      }).unwrap();
      toast.success("Contact message status updated successfully");
      closeStatusModal();
    } catch (updateError) {
      toast.error(
        getApiErrorMessage(updateError, "Failed to update contact message status"),
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingMessage) return;

    try {
      const result = await deleteMessage({ id: deletingMessage.id }).unwrap();
      if (result.pending) {
        toast.info(
          "Delete request submitted and is pending confirmation from an admin.",
        );
      } else {
        toast.success("Contact message deleted successfully");
      }
      setDeletingMessage(null);
    } catch (deleteError) {
      toast.error(
        getApiErrorMessage(deleteError, "Failed to delete contact message"),
      );
    }
  };

  const handleExportCsv = () => {
    if (filteredMessages.length === 0) {
      toast.info("No contact messages to export");
      return;
    }

    exportContactMessagesCsv(filteredMessages);
  };

  return (
    <>
      <PageHeader
        title="Contact Messages"
        subtitle="Manage and review customer inquiries and contact requests from the clinic's public-facing portal."
        action={
          <Button
            leftIcon={<Icon name="description" size={20} />}
            fullWidthOnMobile
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>
        }
      />

      {!isLoading && !isError && (
        <ContactMessageFilters
          draftFilters={draftFilters}
          onDraftChange={setDraftFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      )}

      <Modal
        open={editingMessage !== null}
        onClose={closeStatusModal}
        title="Update Status"
        subtitle={
          editingMessage
            ? `Change status for ${editingMessage.name}`
            : undefined
        }
      >
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-label-md font-medium text-on-surface">
              Status
            </span>
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value as ContactMessageStatus)
              }
              className="w-full rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {CONTACT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={closeStatusModal}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Status"}
            </Button>
          </div>
        </div>
      </Modal>

      <DeleteConfirmationModal
        open={deletingMessage !== null}
        onClose={() => setDeletingMessage(null)}
        onConfirm={handleDelete}
        title="Delete Contact Message"
        itemName={deletingMessage?.name}
        isLoading={isDeleting}
      />

      <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-on-surface-variant">
            <Icon
              name="progress_activity"
              size={32}
              className="animate-spin text-primary"
            />
            <p className="text-body-md">Loading contact messages...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-on-surface-variant">
            <Icon name="error" size={32} className="text-error" />
            <p className="text-body-md">Failed to load contact messages.</p>
          </div>
        ) : (
          <>
            <div className="xl:hidden">
              {paginatedMessages.length === 0 ? (
                <div className="px-4 py-12 text-center text-on-surface-variant">
                  No contact messages found.
                </div>
              ) : (
                <div className="flex flex-col gap-4 p-4">
                  {paginatedMessages.map((message) => (
                    <ContactMessageCard
                      key={message.id}
                      message={message}
                      onView={(item) => navigate(`/contact-messages/${item.id}`)}
                      onEdit={openStatusModal}
                      onDelete={setDeletingMessage}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-outline-variant/50 bg-surface/50 hover:bg-surface/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMessages.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-on-surface-variant"
                      >
                        No contact messages found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              initials={getInitials(message.name)}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <p className="text-body-md font-medium text-on-surface">
                                {message.name}
                              </p>
                              <p className="truncate text-label-sm text-on-surface-variant">
                                {message.email ?? "—"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md text-on-surface">
                            {message.phone}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="line-clamp-1 block max-w-[220px] text-body-md text-on-surface-variant">
                            {message.subject}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(message.status)}>
                            {getStatusLabel(message.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-body-md text-on-surface">
                              {formatContactDate(message.createdAt)}
                            </span>
                            <span className="text-label-sm text-on-surface-variant">
                              {formatContactTime(message.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <ContactMessageActions
                            message={message}
                            onView={(item) =>
                              navigate(`/contact-messages/${item.id}`)
                            }
                            onEdit={openStatusModal}
                            onDelete={setDeletingMessage}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <Pagination
              currentPage={effectivePage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </>
  );
}
