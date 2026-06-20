import type {
  ContactMessage,
  ContactMessageListResponse,
  ContactMessageResponse,
  UpdateContactMessageStatusPayload,
} from "../../types/contact";
import type { DeleteMutationResponse } from "../../types/deleteRequest";
import { baseApi } from "./baseApi";

export const contactMessagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactMessages: builder.query<ContactMessage[], void>({
      query: () => "/api/v1/admin/contact-messages",
      transformResponse: (response: ContactMessageListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ContactMessage" as const,
                id,
              })),
              { type: "ContactMessage", id: "LIST" },
            ]
          : [{ type: "ContactMessage", id: "LIST" }],
    }),
    getContactMessageById: builder.query<ContactMessage, string>({
      query: (id) => `/api/v1/admin/contact-messages/${id}`,
      transformResponse: (response: ContactMessageResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "ContactMessage", id }],
    }),
    updateContactMessageStatus: builder.mutation<
      ContactMessage,
      UpdateContactMessageStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/api/v1/admin/contact-messages/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: ContactMessageResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ContactMessage", id },
        { type: "ContactMessage", id: "LIST" },
      ],
    }),
    deleteContactMessage: builder.mutation<
      DeleteMutationResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/v1/admin/contact-messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) =>
        _result?.pending
          ? [{ type: "DeleteRequest", id: "LIST" }]
          : [
              { type: "ContactMessage", id },
              { type: "ContactMessage", id: "LIST" },
            ],
    }),
  }),
});

export const {
  useGetContactMessagesQuery,
  useGetContactMessageByIdQuery,
  useUpdateContactMessageStatusMutation,
  useDeleteContactMessageMutation,
} = contactMessagesApi;
