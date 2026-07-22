import type {
  Announcement,
  AnnouncementFilterState,
  AnnouncementStatus,
  AnnouncementType,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "../../types/announcement";
import { baseApi } from "./baseApi";

type ListAnnouncementsArgs = {
  page?: number;
  pageSize?: number;
  status?: AnnouncementStatus;
  type?: AnnouncementType;
};

type PaginatedAnnouncements = {
  items: Announcement[];
  total: number;
  page: number;
  pageSize: number;
};

function buildListQuery(params: ListAnnouncementsArgs): string {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params.status) searchParams.set("status", params.status);
  if (params.type) searchParams.set("type", params.type);
  const query = searchParams.toString();
  return query
    ? `/api/v1/admin/announcements?${query}`
    : "/api/v1/admin/announcements";
}

function buildFeedQuery(page = 1, pageSize = 4): string {
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  return `/api/v1/admin/announcements/feed?${searchParams.toString()}`;
}

export const announcementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query<PaginatedAnnouncements, ListAnnouncementsArgs | void>(
      {
        query: (params) => buildListQuery(params ?? {}),
        transformResponse: (response: {
          success: boolean;
          data: Announcement[];
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
                  type: "Announcement" as const,
                  id,
                })),
                { type: "Announcement", id: "LIST" },
              ]
            : [{ type: "Announcement", id: "LIST" }],
      },
    ),
    getActiveAnnouncements: builder.query<Announcement[], void>({
      query: () => "/api/v1/admin/announcements/active",
      transformResponse: (response: { success: boolean; data: Announcement[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Announcement" as const, id })),
              { type: "Announcement", id: "ACTIVE" },
            ]
          : [{ type: "Announcement", id: "ACTIVE" }],
    }),
    getAnnouncementFeed: builder.query<
      PaginatedAnnouncements,
      { page?: number; pageSize?: number } | void
    >({
      query: (params) => buildFeedQuery(params?.page ?? 1, params?.pageSize ?? 4),
      transformResponse: (response: {
        success: boolean;
        data: Announcement[];
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
                type: "Announcement" as const,
                id,
              })),
              { type: "Announcement", id: "FEED" },
            ]
          : [{ type: "Announcement", id: "FEED" }],
    }),
    getUnreadAnnouncementCount: builder.query<number, void>({
      query: () => "/api/v1/admin/announcements/unread-count",
      transformResponse: (response: {
        success: boolean;
        data: { count: number };
      }) => response.data.count,
      providesTags: [{ type: "Announcement", id: "UNREAD" }],
    }),
    getAnnouncementById: builder.query<Announcement, string>({
      query: (id) => `/api/v1/admin/announcements/${id}`,
      transformResponse: (response: { success: boolean; data: Announcement }) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: "Announcement", id }],
    }),
    createAnnouncement: builder.mutation<Announcement, CreateAnnouncementPayload>({
      query: (body) => ({
        url: "/api/v1/admin/announcements",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Announcement }) => response.data,
      invalidatesTags: [
        { type: "Announcement", id: "LIST" },
        { type: "Announcement", id: "ACTIVE" },
        { type: "Announcement", id: "FEED" },
        { type: "Announcement", id: "UNREAD" },
      ],
    }),
    updateAnnouncement: builder.mutation<
      Announcement,
      { id: string; body: UpdateAnnouncementPayload }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/admin/announcements/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: { data: Announcement }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
        { type: "Announcement", id: "ACTIVE" },
        { type: "Announcement", id: "FEED" },
        { type: "Announcement", id: "UNREAD" },
      ],
    }),
    deleteAnnouncement: builder.mutation<{ success: boolean; message?: string }, string>(
      {
        query: (id) => ({
          url: `/api/v1/admin/announcements/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, id) => [
          { type: "Announcement", id },
          { type: "Announcement", id: "LIST" },
          { type: "Announcement", id: "ACTIVE" },
          { type: "Announcement", id: "FEED" },
          { type: "Announcement", id: "UNREAD" },
        ],
      },
    ),
    markAnnouncementRead: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/admin/announcements/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "ACTIVE" },
        { type: "Announcement", id: "FEED" },
        { type: "Announcement", id: "UNREAD" },
      ],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetActiveAnnouncementsQuery,
  useGetAnnouncementFeedQuery,
  useGetUnreadAnnouncementCountQuery,
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useMarkAnnouncementReadMutation,
} = announcementsApi;

export function filtersToListArgs(
  filters: AnnouncementFilterState,
  page = 1,
  pageSize = 10,
): ListAnnouncementsArgs {
  return {
    page,
    pageSize,
    type: filters.type || undefined,
    status: filters.status || undefined,
  };
}
