import type {
  DeleteRequestActionResponse,
  DeleteRequestEntityType,
  DeleteRequestListItem,
  DeleteRequestListResponse,
} from "../../types/deleteRequest";
import { baseApi } from "./baseApi";

export const deleteRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingDeleteRequests: builder.query<
      DeleteRequestListItem[],
      DeleteRequestEntityType | void
    >({
      query: (entityType) => {
        const searchParams = new URLSearchParams();
        if (entityType) {
          searchParams.set("entityType", entityType);
        }
        const query = searchParams.toString();
        return `/api/v1/admin/delete-requests${query ? `?${query}` : ""}`;
      },
      transformResponse: (response: DeleteRequestListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "DeleteRequest" as const,
                id,
              })),
              { type: "DeleteRequest", id: "LIST" },
            ]
          : [{ type: "DeleteRequest", id: "LIST" }],
    }),
    approveDeleteRequest: builder.mutation<DeleteRequestActionResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/delete-requests/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "DeleteRequest", id: "LIST" },
        { type: "Blog", id: "LIST" },
        { type: "Appointment", id: "LIST" },
        { type: "ContactMessage", id: "LIST" },
      ],
    }),
    rejectDeleteRequest: builder.mutation<DeleteRequestActionResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/delete-requests/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "DeleteRequest", id: "LIST" },
        { type: "Blog", id: "LIST" },
        { type: "Appointment", id: "LIST" },
        { type: "ContactMessage", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPendingDeleteRequestsQuery,
  useApproveDeleteRequestMutation,
  useRejectDeleteRequestMutation,
} = deleteRequestsApi;
