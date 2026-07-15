import type {
  CreateManagedUserPayload,
  ManagedUser,
  ManagedUserListResponse,
  ManagedUserResponse,
  ResetManagedUserPasswordPayload,
  UpdateManagedUserActivePayload,
  UpdateManagedUserPayload,
  UpdateManagedUserRolePayload,
} from "../../types/userManagement";
import { baseApi } from "./baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ManagedUser[], void>({
      query: () => "/api/v1/admin/users",
      transformResponse: (response: ManagedUserListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ManagedUser" as const, id })),
              { type: "ManagedUser", id: "LIST" },
            ]
          : [{ type: "ManagedUser", id: "LIST" }],
    }),
    createUser: builder.mutation<ManagedUser, CreateManagedUserPayload>({
      query: (body) => ({
        url: "/api/v1/admin/users",
        method: "POST",
        body,
      }),
      transformResponse: (response: ManagedUserResponse) => response.data,
      invalidatesTags: [{ type: "ManagedUser", id: "LIST" }],
    }),
    updateUser: builder.mutation<ManagedUser, UpdateManagedUserPayload>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/admin/users/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ManagedUserResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ManagedUser", id },
        { type: "ManagedUser", id: "LIST" },
      ],
    }),
    updateUserRole: builder.mutation<ManagedUser, UpdateManagedUserRolePayload>({
      query: ({ id, role }) => ({
        url: `/api/v1/admin/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      transformResponse: (response: ManagedUserResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ManagedUser", id },
        { type: "ManagedUser", id: "LIST" },
      ],
    }),
    updateUserActive: builder.mutation<
      ManagedUser,
      UpdateManagedUserActivePayload
    >({
      query: ({ id, isActive }) => ({
        url: `/api/v1/admin/users/${id}/active`,
        method: "PATCH",
        body: { isActive },
      }),
      transformResponse: (response: ManagedUserResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ManagedUser", id },
        { type: "ManagedUser", id: "LIST" },
      ],
    }),
    resetUserPassword: builder.mutation<
      ManagedUser,
      ResetManagedUserPasswordPayload
    >({
      query: ({ id, password }) => ({
        url: `/api/v1/admin/users/${id}/password`,
        method: "PATCH",
        body: { password },
      }),
      transformResponse: (response: ManagedUserResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ManagedUser", id },
        { type: "ManagedUser", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useUpdateUserActiveMutation,
  useResetUserPasswordMutation,
} = usersApi;
