import { baseApi } from "./baseApi";

export type AnalyticsSettings = {
  pixelId: string | null;
  hasToken: boolean;
  testEventCode: string | null;
  enabled: boolean;
};

export type UpsertAnalyticsSettingsPayload = {
  pixelId?: string | null;
  accessToken?: string;
  testEventCode?: string | null;
  enabled?: boolean;
};

export const analyticsSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsSettings: builder.query<AnalyticsSettings, void>({
      query: () => "/api/v1/admin/analytics-settings",
      transformResponse: (response: { success: boolean; data: AnalyticsSettings }) =>
        response.data,
      providesTags: ["AnalyticsSetting"],
    }),
    upsertAnalyticsSettings: builder.mutation<
      AnalyticsSettings,
      UpsertAnalyticsSettingsPayload
    >({
      query: (body) => ({
        url: "/api/v1/admin/analytics-settings",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: { success: boolean; data: AnalyticsSettings }) =>
        response.data,
      invalidatesTags: ["AnalyticsSetting"],
    }),
  }),
});

export const {
  useGetAnalyticsSettingsQuery,
  useUpsertAnalyticsSettingsMutation,
} = analyticsSettingsApi;
