import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminFilters } from "../components/admins/AdminFilters";
import { AdminRowActions } from "../components/admins/AdminRowActions";
import {
  Avatar,
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
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useSetAdminActiveMutation,
} from "../store/api/adminsApi";
import type { AdminFilterState, AdminManagedUser } from "../types/admin";
import {
  canManageAdminTarget,
  getApiErrorMessage,
  getInitials,
  getRoleLabel,
  isAdminUserActive,
} from "../utils/admin";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: AdminFilterState = {
  search: "",
  role: "",
  status: "",
};

export function AdminsPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [draftFilters, setDraftFilters] =
    useState<AdminFilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<AdminFilterState>(DEFAULT_FILTERS);
  const [deletingUser, setDeletingUser] = useState<AdminManagedUser | null>(
    null,
  );

  const listArgs = useMemo(
    () => filtersToListArgs(appliedFilters, currentPage, PAGE_SIZE),
    [appliedFilters, currentPage],
  );

  const { data, isLoading, isError, error, refetch } =
    useGetAdminsQuery(listArgs);
  const [setAdminActive, { isLoading: isToggling }] =
    useSetAdminActiveMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const users = data?.items ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const effectivePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, "Failed to load admin users"));
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

  const handleToggleActive = async (adminUser: AdminManagedUser) => {
    const nextActive = !isAdminUserActive(adminUser.active);
    try {
      await setAdminActive({ id: adminUser.id, active: nextActive }).unwrap();
      toast.success(
        nextActive
          ? "Admin user activated successfully"
          : "Admin user deactivated successfully",
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update admin status"));
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteAdmin(deletingUser.id).unwrap();
      toast.success("Admin user deleted successfully");
      setDeletingUser(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete admin user"));
    }
  };

  return (
    <div>
      <PageHeader
        title="Admin Management"
        subtitle="Manage and monitor administrative access and roles."
        action={
          <Button
            leftIcon={<Icon name="person_add" size={18} />}
            onClick={() => navigate("/admins/new")}
          >
            Add New Admin
          </Button>
        }
      />

      <AdminFilters
        draftFilters={draftFilters}
        onDraftChange={setDraftFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-on-surface-variant">
            <Icon name="progress_activity" size={22} className="animate-spin" />
            Loading admin users...
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <p className="text-body-md text-error">Failed to load admin users.</p>
            <Button type="button" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Icon name="group_off" size={32} className="text-outline" />
            <p className="text-body-md text-on-surface-variant">
              No admin users match your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 xl:hidden">
              {users.map((adminUser) => {
                const isSelf = currentUser?.id === adminUser.id;
                const canManage =
                  !isSelf &&
                  !!currentUser &&
                  canManageAdminTarget(currentUser.role, adminUser.role);
                const active = isAdminUserActive(adminUser.active);

                return (
                  <article
                    key={adminUser.id}
                    className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          initials={getInitials(adminUser.name)}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-body-md font-semibold text-on-surface">
                            {adminUser.name ?? "—"}
                          </p>
                          <p className="truncate text-label-sm text-on-surface-variant">
                            {adminUser.email ?? "—"}
                          </p>
                        </div>
                      </div>
                      <AdminRowActions
                        user={adminUser}
                        disabled={!canManage}
                        onEdit={(user) =>
                          navigate(`/admins/${user.id}/edit`, {
                            state: { user },
                          })
                        }
                        onToggleActive={handleToggleActive}
                        onDelete={setDeletingUser}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="neutral">
                        {getRoleLabel(adminUser.role)}
                      </Badge>
                      <Badge variant={active ? "confirmed" : "cancel"}>
                        {active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="mt-3 text-body-sm text-on-surface-variant">
                      {adminUser.phone ?? "No phone"}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((adminUser) => {
                    const isSelf = currentUser?.id === adminUser.id;
                    const canManage =
                      !isSelf &&
                      !!currentUser &&
                      canManageAdminTarget(currentUser.role, adminUser.role);
                    const active = isAdminUserActive(adminUser.active);

                    return (
                      <TableRow key={adminUser.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              initials={getInitials(adminUser.name)}
                              size="sm"
                            />
                            <span className="font-medium text-on-surface">
                              {adminUser.name ?? "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{adminUser.email ?? "—"}</TableCell>
                        <TableCell>{adminUser.phone ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="neutral">
                            {getRoleLabel(adminUser.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={active ? "confirmed" : "cancel"}>
                            {active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <AdminRowActions
                            user={adminUser}
                            disabled={!canManage}
                            onEdit={(user) =>
                              navigate(`/admins/${user.id}/edit`, {
                                state: { user },
                              })
                            }
                            onToggleActive={handleToggleActive}
                            onDelete={setDeletingUser}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      <DeleteConfirmationModal
        open={Boolean(deletingUser)}
        title="Delete Admin User"
        description={
          deletingUser
            ? `Are you sure you want to permanently delete ${deletingUser.name ?? deletingUser.email ?? "this user"}? This cannot be undone.`
            : undefined
        }
        isLoading={isDeleting || isToggling}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
