import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import {
  Avatar,
  Badge,
  Button,
  Icon,
  Input,
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
import { useAdminAuth } from "../contexts/AdminAuthContext";
import type { StaffRole } from "../constants/permissions";
import { canAccessAdminPermission } from "../constants/permissions";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useResetUserPasswordMutation,
  useUpdateUserActiveMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
} from "../store/api/usersApi";
import {
  formatStaffRole,
  STAFF_ROLE_OPTIONS,
  type ManagedUser,
} from "../types/userManagement";

const PAGE_SIZE = 10;

type UserFormState = {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  password: string;
};

const EMPTY_CREATE_FORM: UserFormState = {
  name: "",
  email: "",
  phone: "",
  role: "SUPPORT",
  password: "",
};

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string") {
      return data.message;
    }
  }
  return fallback;
}

function getInitials(name: string | null, email: string | null): string {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function assignableRoles(actorRole: StaffRole): StaffRole[] {
  if (actorRole === "SUPER_ADMIN") {
    return STAFF_ROLE_OPTIONS.map((option) => option.value);
  }
  return STAFF_ROLE_OPTIONS.filter(
    (option) => option.value !== "SUPER_ADMIN",
  ).map((option) => option.value);
}

function RoleSelect({
  value,
  onChange,
  options,
  id,
}: {
  value: StaffRole;
  onChange: (role: StaffRole) => void;
  options: StaffRole[];
  id: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value as StaffRole)}
      className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
    >
      {options.map((role) => (
        <option key={role} value={role}>
          {formatStaffRole(role)}
        </option>
      ))}
    </select>
  );
}

export function UsersPage() {
  const { user: currentUser } = useAdminAuth();
  const canManageUsers = canAccessAdminPermission(
    currentUser?.role ?? "SUPPORT",
    "userManagement",
  );

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetUsersQuery(undefined, { skip: !canManageUsers });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();
  const [updateUserActive, { isLoading: isUpdatingActive }] =
    useUpdateUserActiveMutation();
  const [resetUserPassword, { isLoading: isResettingPassword }] =
    useResetUserPasswordMutation();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<UserFormState>(EMPTY_CREATE_FORM);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [roleUser, setRoleUser] = useState<ManagedUser | null>(null);
  const [roleValue, setRoleValue] = useState<StaffRole>("SUPPORT");
  const [passwordUser, setPasswordUser] = useState<ManagedUser | null>(null);
  const [passwordValue, setPasswordValue] = useState("");
  const [statusUser, setStatusUser] = useState<ManagedUser | null>(null);

  const roleOptions = useMemo(
    () => assignableRoles(currentUser?.role ?? "ADMIN"),
    [currentUser?.role],
  );

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, "Failed to load users"));
    }
  }, [isError, error]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const haystack = [user.name, user.email, user.phone, user.role]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const openEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    });
  };

  const openRole = (user: ManagedUser) => {
    setRoleUser(user);
    setRoleValue(
      roleOptions.includes(user.role) ? user.role : (roleOptions[0] ?? "SUPPORT"),
    );
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createUser({
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        phone: createForm.phone.trim() || null,
        role: createForm.role,
        password: createForm.password,
      }).unwrap();
      toast.success("User created");
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE_FORM);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create user"));
    }
  };

  const handleEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingUser) return;
    try {
      await updateUser({
        id: editingUser.id,
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim() || null,
      }).unwrap();
      toast.success("User updated");
      setEditingUser(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update user"));
    }
  };

  const handleRole = async (event: FormEvent) => {
    event.preventDefault();
    if (!roleUser) return;
    try {
      await updateUserRole({ id: roleUser.id, role: roleValue }).unwrap();
      toast.success("Role updated");
      setRoleUser(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update role"));
    }
  };

  const handlePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!passwordUser) return;
    try {
      await resetUserPassword({
        id: passwordUser.id,
        password: passwordValue,
      }).unwrap();
      toast.success("Password reset");
      setPasswordUser(null);
      setPasswordValue("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to reset password"));
    }
  };

  const handleToggleActive = async () => {
    if (!statusUser) return;
    try {
      await updateUserActive({
        id: statusUser.id,
        isActive: !statusUser.isActive,
      }).unwrap();
      toast.success(
        statusUser.isActive ? "User deactivated" : "User activated",
      );
      setStatusUser(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update user status"));
    }
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Create and manage admin panel staff accounts."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              leftIcon={<Icon name="refresh" size={20} />}
              onClick={() => {
                void refetch();
              }}
              disabled={isFetching}
            >
              Refresh
            </Button>
            {canManageUsers ? (
              <Button
                leftIcon={<Icon name="person_add" size={20} />}
                onClick={() => setCreateOpen(true)}
              >
                Create User
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="mb-stack-md max-w-md">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, or role"
          leftIcon={<Icon name="search" size={18} />}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
        {isLoading ? (
          <p className="p-stack-lg text-body-md text-on-surface-variant">
            Loading users...
          </p>
        ) : pageUsers.length === 0 ? (
          <p className="p-stack-lg text-body-md text-on-surface-variant">
            No users found.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageUsers.map((user) => {
                const isSelf = user.id === currentUser?.id;
                const canMutateTarget =
                  currentUser?.role === "SUPER_ADMIN" ||
                  user.role !== "SUPER_ADMIN";
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          initials={getInitials(user.name, user.email)}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-body-md font-semibold text-on-surface">
                            {user.name?.trim() || "—"}
                          </p>
                          <p className="truncate text-label-sm text-on-surface-variant">
                            {user.email ?? "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral">{formatStaffRole(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "confirmed" : "cancel"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {canMutateTarget ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="Edit user"
                              onClick={() => openEdit(user)}
                            >
                              <Icon name="edit" size={20} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="Change role"
                              onClick={() => openRole(user)}
                              disabled={isSelf && user.role === "SUPER_ADMIN"}
                            >
                              <Icon name="badge" size={20} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="Reset password"
                              onClick={() => {
                                setPasswordUser(user);
                                setPasswordValue("");
                              }}
                            >
                              <Icon name="lock_reset" size={20} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={
                                user.isActive
                                  ? "Deactivate user"
                                  : "Activate user"
                              }
                              onClick={() => setStatusUser(user)}
                              disabled={isSelf}
                            >
                              <Icon
                                name={user.isActive ? "person_off" : "person"}
                                size={20}
                              />
                            </Button>
                          </>
                        ) : (
                          <span className="text-label-sm text-on-surface-variant">
                            —
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {filteredUsers.length > PAGE_SIZE ? (
        <div className="mt-stack-md">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      ) : null}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create User"
        subtitle="Add a new staff account for the admin panel."
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">Name</span>
            <Input
              value={createForm.name}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">Email</span>
            <Input
              type="email"
              value={createForm.email}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">Phone</span>
            <Input
              value={createForm.phone}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
          </label>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">Role</span>
            <RoleSelect
              id="create-role"
              value={createForm.role}
              options={roleOptions}
              onChange={(role) =>
                setCreateForm((prev) => ({ ...prev, role }))
              }
            />
          </label>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">
              Temporary password
            </span>
            <Input
              type="password"
              value={createForm.password}
              onChange={(event) =>
                setCreateForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              minLength={8}
              required
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        subtitle={editingUser?.email ?? undefined}
      >
        <form className="space-y-4" onSubmit={handleEdit}>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">Name</span>
            <Input
              value={editForm.name}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">Email</span>
            <Input
              type="email"
              value={editForm.email}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">Phone</span>
            <Input
              value={editForm.phone}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(roleUser)}
        onClose={() => setRoleUser(null)}
        title="Change Role"
        subtitle={roleUser?.email ?? undefined}
      >
        <form className="space-y-4" onSubmit={handleRole}>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">Role</span>
            <RoleSelect
              id="edit-role"
              value={roleValue}
              options={roleOptions}
              onChange={setRoleValue}
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRoleUser(null)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdatingRole}>
              {isUpdatingRole ? "Saving..." : "Update role"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(passwordUser)}
        onClose={() => setPasswordUser(null)}
        title="Reset Password"
        subtitle={passwordUser?.email ?? undefined}
      >
        <form className="space-y-4" onSubmit={handlePassword}>
          <label className="block space-y-1">
            <span className="text-label-sm text-on-surface-variant">
              New password
            </span>
            <Input
              type="password"
              value={passwordValue}
              onChange={(event) => setPasswordValue(event.target.value)}
              minLength={8}
              required
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPasswordUser(null)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isResettingPassword}>
              {isResettingPassword ? "Saving..." : "Reset password"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(statusUser)}
        onClose={() => setStatusUser(null)}
        title={statusUser?.isActive ? "Deactivate User" : "Activate User"}
        subtitle={statusUser?.email ?? undefined}
      >
        <p className="text-body-md text-on-surface-variant">
          {statusUser?.isActive
            ? "This user will lose access to the admin panel until reactivated."
            : "This user will regain access to the admin panel."}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setStatusUser(null)}>
            Cancel
          </Button>
          <Button onClick={handleToggleActive} disabled={isUpdatingActive}>
            {isUpdatingActive
              ? "Saving..."
              : statusUser?.isActive
                ? "Deactivate"
                : "Activate"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
