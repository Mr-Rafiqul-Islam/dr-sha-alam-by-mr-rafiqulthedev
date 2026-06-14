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
      await deleteMessage({ id: deletingMessage.id }).unwrap();
      toast.success("Contact message deleted successfully");
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-outline-variant/50 bg-surface/50 hover:bg-surface/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
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
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="View contact message"
                              onClick={() =>
                                navigate(`/contact-messages/${message.id}`)
                              }
                            >
                              <Icon name="visibility" size={20} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="Edit contact message status"
                              onClick={() => openStatusModal(message)}
                            >
                              <Icon name="edit" size={20} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-error-container/50 hover:text-error"
                              aria-label="Delete contact message"
                              onClick={() => setDeletingMessage(message)}
                            >
                              <Icon name="delete" size={20} />
                            </Button>
                          </div>
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
