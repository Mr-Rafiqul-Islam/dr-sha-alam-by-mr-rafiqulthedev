import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminForm } from "../components/admins/AdminForm";
import { Button, Icon, PageHeader } from "../components/common";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import {
  useCreateAdminMutation,
  useGetAdminsQuery,
  useUpdateAdminMutation,
} from "../store/api/adminsApi";
import type {
  AdminManagedUser,
  CreateAdminPayload,
  UpdateAdminPayload,
} from "../types/admin";
import {
  canManageAdminTarget,
  getApiErrorMessage,
} from "../utils/admin";

type EditLocationState = {
  user?: AdminManagedUser;
};

export function AdminFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAdminAuth();
  const isEdit = Boolean(id);

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();

  const locationUser = (location.state as EditLocationState | null)?.user;
  const { data, isLoading: isLoadingUsers, isError } = useGetAdminsQuery(
    isEdit && !locationUser ? { pageSize: 100 } : undefined,
    { skip: !isEdit || Boolean(locationUser) },
  );

  const editingUser = useMemo(() => {
    if (!isEdit || !id) return null;
    if (locationUser && locationUser.id === id) return locationUser;
    return data?.items.find((item) => item.id === id) ?? null;
  }, [isEdit, id, locationUser, data?.items]);

  const goBack = () => navigate("/admins");

  const handleCreate = async (payload: CreateAdminPayload) => {
    try {
      await createAdmin({ ...payload, active: true }).unwrap();
      toast.success("Admin user created successfully");
      goBack();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create admin user"));
    }
  };

  const handleUpdate = async (
    targetId: string,
    payload: UpdateAdminPayload,
  ) => {
    try {
      await updateAdmin({ id: targetId, body: payload }).unwrap();
      toast.success("Admin user updated successfully");
      goBack();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update admin user"));
    }
  };

  if (isEdit) {
    if (isLoadingUsers && !editingUser) {
      return (
        <div className="flex items-center justify-center gap-2 py-20 text-on-surface-variant">
          <Icon name="progress_activity" size={22} className="animate-spin" />
          Loading admin user...
        </div>
      );
    }

    if (isError || !editingUser) {
      return (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-body-md text-error">Admin user not found.</p>
          <Button type="button" onClick={goBack}>
            Back to Admin Management
          </Button>
        </div>
      );
    }

    if (
      !currentUser ||
      currentUser.id === editingUser.id ||
      !canManageAdminTarget(currentUser.role, editingUser.role)
    ) {
      return (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-body-md text-error">
            You do not have permission to edit this user.
          </p>
          <Button type="button" onClick={goBack}>
            Back to Admin Management
          </Button>
        </div>
      );
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Admin" : "Create Admin"}
        subtitle={
          isEdit
            ? "Update administrative access and profile details."
            : "Add a new staff account with role-based access."
        }
        action={
          <Button
            variant="ghost"
            leftIcon={<Icon name="arrow_back" size={20} />}
            onClick={goBack}
            className="border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface hover:bg-surface-container-high"
          >
            Back to Admin Management
          </Button>
        }
      />

      <div className="mx-auto max-w-3xl">
        <AdminForm
          mode={isEdit ? "edit" : "create"}
          actorRole={currentUser?.role ?? "ADMIN"}
          user={editingUser}
          isLoading={isCreating || isUpdating}
          onCancel={goBack}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
