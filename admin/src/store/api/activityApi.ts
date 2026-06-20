import type {
  ActivityFeedParams,
  ActivityFeedResponse,
  ActivityLogEntry,
  TraceableStaffMember,
  TraceableStaffResponse,
} from "../../types/activity";
import { baseApi } from "./baseApi";

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTraceableStaff: builder.query<TraceableStaffMember[], void>({
      query: () => "/api/v1/admin/activity/staff",
      transformResponse: (response: TraceableStaffResponse) => response.data,
      providesTags: [{ type: "ActivityLog", id: "STAFF" }],
    }),
    getActivityFeed: builder.query<
      { items: ActivityLogEntry[]; nextCursor: string | null },
      ActivityFeedParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.actorId) {
          searchParams.set("actorId", params.actorId);
        }

        if (params?.limit) {
          searchParams.set("limit", String(params.limit));
        }

        if (params?.cursor) {
          searchParams.set("cursor", params.cursor);
        }

        const query = searchParams.toString();
        return `/api/v1/admin/activity${query ? `?${query}` : ""}`;
      },
      transformResponse: (response: ActivityFeedResponse) => ({
        items: response.data,
        nextCursor: response.nextCursor,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "ActivityLog" as const,
                id,
              })),
              { type: "ActivityLog", id: "LIST" },
            ]
          : [{ type: "ActivityLog", id: "LIST" }],
    }),
  }),
});

export const { useGetTraceableStaffQuery, useGetActivityFeedQuery } = activityApi;
