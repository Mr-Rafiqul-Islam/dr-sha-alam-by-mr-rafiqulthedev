import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AnnouncementFormModal } from "../components/announcements/AnnouncementFormModal";
import {
  Badge,
  Button,
  DeleteConfirmationModal,
  Icon,
  PageHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/common";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import {
  filtersToListArgs,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAnnouncementsQuery,
  useUpdateAnnouncementMutation,
} from "../store/api/announcementsApi";
import type {
  Announcement,
  AnnouncementFilterState,
  AnnouncementFormValues,
} from "../types/announcement";
import {
  canManageAnnouncements,
  formatAnnouncementDate,
  getAnnouncementTypeLabel,
  getAnnouncementTypeStyles,
  getApiErrorMessage,
} from "../utils/announcement";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: AnnouncementFilterState = {
  type: "",
  status: "",
};

function formValuesToPayload(values: AnnouncementFormValues) {
  return {
    title: values.title.trim(),
    content: values.content.trim(),
    type: values.type,
    status: values.status,
  };
}

export function AnnouncementsPage() {
  const { user } = useAdminAuth();
  const canManage = canManageAnnouncements(user?.role);
  const [currentPage, setCurrentPage] = useState(1);
  const [draftFilters, setDraftFilters] =
    useState<AnnouncementFilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<AnnouncementFilterState>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] =
    useState<Announcement | null>(null);

  const listArgs = useMemo(
    () => filtersToListArgs(appliedFilters, currentPage, PAGE_SIZE),
    [appliedFilters, currentPage],
  );

  const { data, isLoading, isError, error, refetch } =
    useGetAnnouncementsQuery(listArgs);
  const [createAnnouncement, { isLoading: isCreating }] =
    useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] =
    useUpdateAnnouncementMutation();
  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();

  const items = data?.items ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const effectivePage = Math.min(currentPage, totalPages);

  if (currentPage !== effectivePage) {
    setCurrentPage(effectivePage);
  }

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, "Failed to load announcements"));
    }
  }, [isError, error]);

  const handleSearch = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormOpen(true);
  };

  const handleSubmit = async (values: AnnouncementFormValues) => {
    const payload = formValuesToPayload(values);
    try {
      if (editingAnnouncement) {
        await updateAnnouncement({
          id: editingAnnouncement.id,
          body: payload,
        }).unwrap();
        toast.success("Announcement updated successfully");
      } else {
        await createAnnouncement(payload).unwrap();
        toast.success("Announcement created successfully");
      }
      setFormOpen(false);
      setEditingAnnouncement(null);
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          editingAnnouncement
            ? "Failed to update announcement"
            : "Failed to create announcement",
        ),
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingAnnouncement) return;
    try {
      await deleteAnnouncement(deletingAnnouncement.id).unwrap();
      toast.success("Announcement deleted successfully");
      setDeletingAnnouncement(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete announcement"));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Create and manage staff notices. Active announcements show in the notification bar until marked inactive."
        action={
          canManage ? (
            <Button onClick={handleOpenCreate}>
              <Icon name="add" size={18} />
              New announcement
            </Button>
          ) : undefined
        }
      />

      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <select
            value={draftFilters.type}
            onChange={(event) =>
              setDraftFilters((prev) => ({
                ...prev,
                type: event.target.value as AnnouncementFilterState["type"],
              }))
            }
            className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md"
          >
            <option value="">All types</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
            value={draftFilters.status}
            onChange={(event) =>
              setDraftFilters((prev) => ({
                ...prev,
                status: event.target.value as AnnouncementFilterState["status"],
              }))
            }
            className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <Button onClick={handleSearch}>Apply filters</Button>
          <Button variant="icon" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Icon name="progress_activity" className="animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <Icon name="error" className="text-error" size={32} />
            <p className="text-body-lg text-on-surface-variant">
              Failed to load announcements.
            </p>
            <Button variant="ghost" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <Icon name="campaign" className="text-on-surface-variant" size={32} />
            <p className="text-body-lg text-on-surface-variant">
              No announcements found.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Created by</TableHead>
                {canManage ? <TableHead className="text-right">Actions</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((announcement) => {
                const typeStyles = getAnnouncementTypeStyles(announcement.type);
                return (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-on-surface">
                          {announcement.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-body-sm text-on-surface-variant">
                          {announcement.content}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={typeStyles.badge}>
                        {getAnnouncementTypeLabel(announcement.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          announcement.status === "ACTIVE"
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-surface-container-high text-on-surface-variant"
                        }
                      >
                        {announcement.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatAnnouncementDate(announcement.createdAt)}</TableCell>
                    <TableCell>
                      {announcement.createdBy?.name ??
                        announcement.createdBy?.email ??
                        "—"}
                    </TableCell>
                    {canManage ? (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="icon"
                            aria-label="Edit announcement"
                            onClick={() => handleOpenEdit(announcement)}
                          >
                            <Icon name="edit" size={18} />
                          </Button>
                          <Button
                            variant="icon"
                            aria-label="Delete announcement"
                            onClick={() => setDeletingAnnouncement(announcement)}
                          >
                            <Icon name="delete" size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 ? (
        <Pagination
          currentPage={effectivePage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      ) : null}

      <AnnouncementFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingAnnouncement(null);
        }}
        onSubmit={handleSubmit}
        initialAnnouncement={editingAnnouncement}
        isSubmitting={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        open={Boolean(deletingAnnouncement)}
        onClose={() => setDeletingAnnouncement(null)}
        onConfirm={handleDelete}
        title="Delete announcement"
        description={`Are you sure you want to delete "${deletingAnnouncement?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
