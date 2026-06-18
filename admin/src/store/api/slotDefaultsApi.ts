import type {
  SiteRef,
  SlotDefaultsConfig,
  SlotDefaultsPayload,
  SlotDefaultsResponse,
} from "../../types/slotDefaults";
import { baseApi } from "./baseApi";

export const slotDefaultsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSlotDefaults: builder.query<SlotDefaultsConfig, SiteRef | void>({
      query: (siteRef) => {
        const resolvedSiteRef = siteRef ?? "DOCTOR_SHA_ALAM";
        return `/api/v1/admin/appointment-schedules/defaults?siteRef=${encodeURIComponent(resolvedSiteRef)}`;
      },
      transformResponse: (response: SlotDefaultsResponse) => response.data,
      providesTags: (_result, _error, siteRef) => [
        { type: "SlotDefault", id: siteRef ?? "DOCTOR_SHA_ALAM" },
      ],
    }),
    updateSlotDefaults: builder.mutation<
      SlotDefaultsConfig,
      SlotDefaultsPayload
    >({
      query: (body) => ({
        url: "/api/v1/admin/appointment-schedules/defaults",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: SlotDefaultsResponse) => response.data,
      invalidatesTags: (_result, _error, { siteRef }) => [
        { type: "SlotDefault", id: siteRef },
      ],
    }),
  }),
});

export const {
  useGetSlotDefaultsQuery,
  useUpdateSlotDefaultsMutation,
} = slotDefaultsApi;
