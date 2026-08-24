import { adminApiFetch } from "../../lib/adminAuth";
import { baseApi } from "./baseApi";

export type PaymentSettings = {
  bkashMerchantQrUrl: string | null;
  bkashMerchantQrPublicId: string | null;
};

type PaymentSettingsResponse = {
  success: boolean;
  message?: string;
  data: PaymentSettings;
};

type ImageUploadResponse = {
  success: boolean;
  payload: { image: string; imagePublicId: string };
};

export const paymentSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentSettings: builder.query<PaymentSettings, void>({
      query: () => "/api/v1/admin/payment-settings",
      transformResponse: (response: PaymentSettingsResponse) => response.data,
      providesTags: ["PaymentSetting"],
    }),
    upsertPaymentSettings: builder.mutation<
      PaymentSettings,
      Partial<PaymentSettings>
    >({
      query: (body) => ({
        url: "/api/v1/admin/payment-settings",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: PaymentSettingsResponse) => response.data,
      invalidatesTags: ["PaymentSetting"],
    }),
    uploadBkashQrImage: builder.mutation<
      ImageUploadResponse["payload"],
      File
    >({
      queryFn: async (file) => {
        try {
          const formData = new FormData();
          formData.append("drsa-file", file);
          const response = await adminApiFetch(
            "/api/v1/admin/payment-settings/upload-image",
            { method: "POST", body: formData },
          );
          const data = (await response.json()) as
            | ImageUploadResponse
            | { success: false; message: string };

          if (!response.ok || !("payload" in data)) {
            return {
              error: {
                status: response.status,
                data: {
                  message:
                    "message" in data ? data.message : "Image upload failed",
                },
              },
            };
          }

          return { data: data.payload };
        } catch {
          return {
            error: {
              status: "FETCH_ERROR" as const,
              error: "Image upload failed",
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGetPaymentSettingsQuery,
  useUpsertPaymentSettingsMutation,
  useUploadBkashQrImageMutation,
} = paymentSettingsApi;
