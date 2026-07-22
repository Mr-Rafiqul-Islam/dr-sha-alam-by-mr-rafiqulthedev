import type { StaffRole } from "../../constants/permissions";
import type {
  AdminFilterState,
  AdminManagedUser,
  CreateAdminPayload,
  UpdateAdminPayload,
} from "../../types/admin";
import { baseApi } from "./baseApi";

type ListAdminsArgs = {
  search?: string;
  role?: StaffRole;
  active?: boolean;
  page?: number;
  pageSize?: number;
};

function buildListQuery(params: ListAdminsArgs): string {
  const searchParams = new URLSearchParams();
  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }
  if (params.role) {
    searchParams.set("role", params.role);
  }
  if (params.active !== undefined) {
    searchParams.set("active", String(params.active));
  }
  if (params.page) {
    searchParams.set("page", String(params.page));
  }
  if (params.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }
  const query = searchParams.toString();
  return query
    ? `/api/v1/admin/users?${query}`
    : "/api/v1/admin/users";
}

export const adminsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<
      { items: AdminManagedUser[]; total: number; page: number; pageSize: number },
      ListAdminsArgs | void
    >({
      query: (params) => buildListQuery(params ?? {}),
      transformResponse: (response: {
        success: boolean;
        data: AdminManagedUser[];
        meta: { total: number; page: number; pageSize: number };
      }) => ({
        items: response.data,
        total: response.meta.total,
        page: response.meta.page,
        pageSize: response.meta.pageSize,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "AdminUser" as const,
                id,
              })),
              { type: "AdminUser", id: "LIST" },
            ]
          : [{ type: "AdminUser", id: "LIST" }],
    }),
    createAdmin: builder.mutation<AdminManagedUser, CreateAdminPayload>({
      query: (body) => ({
        url: "/api/v1/admin/users",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: AdminManagedUser }) => response.data,
      invalidatesTags: [{ type: "AdminUser", id: "LIST" }],
    }),
    updateAdmin: builder.mutation<
      AdminManagedUser,
      { id: string; body: UpdateAdminPayload }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/admin/users/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: { data: AdminManagedUser }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AdminUser", id },
        { type: "AdminUser", id: "LIST" },
      ],
    }),
    setAdminActive: builder.mutation<
      AdminManagedUser,
      { id: string; active: boolean }
    >({
      query: ({ id, active }) => ({
        url: `/api/v1/admin/users/${id}/active`,
        method: "PATCH",
        body: { active },
      }),
      transformResponse: (response: { data: AdminManagedUser }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AdminUser", id },
        { type: "AdminUser", id: "LIST" },
      ],
    }),
    deleteAdmin: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AdminUser", id },
        { type: "AdminUser", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useSetAdminActiveMutation,
  useDeleteAdminMutation,
} = adminsApi;

export function filtersToListArgs(
  filters: AdminFilterState,
  page = 1,
  pageSize = 10,
): ListAdminsArgs {
  return {
    search: filters.search.trim() || undefined,
    role: filters.role || undefined,
    active:
      filters.status === "active"
        ? true
        : filters.status === "inactive"
          ? false
          : undefined,
    page,
    pageSize,
  };
}
