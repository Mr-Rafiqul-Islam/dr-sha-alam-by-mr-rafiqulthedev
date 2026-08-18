import type {
  Appointment,
  AppointmentCategoryFilter,
  AppointmentResponse,
  AppointmentsListResponse,
  AppointmentStatus,
  CreateAppointmentPayload,
  AppointmentFeeDiscountInput,
} from "../../types/appointment";
import type { DeleteMutationResponse } from "../../types/deleteRequest";
import { baseApi } from "./baseApi";

export type GetAppointmentsArgs = {
  categories?: AppointmentCategoryFilter[];
};

function buildAppointmentsListUrl(categories?: AppointmentCategoryFilter[]): string {
  if (!categories?.length) {
    return "/api/v1/admin/appointments";
  }

  const params = new URLSearchParams();
  [...categories].sort().forEach((category) => {
    params.append("category", category);
  });

  return `/api/v1/admin/appointments?${params.toString()}`;
}

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query<Appointment[], GetAppointmentsArgs | void>({
      query: (args) => {
        const categories = args?.categories?.length
          ? [...args.categories].sort()
          : undefined;

        return buildAppointmentsListUrl(categories);
      },
      transformResponse: (response: AppointmentsListResponse) =>
        response.appointments,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Appointment" as const, id })),
              { type: "Appointment", id: "LIST" },
            ]
          : [{ type: "Appointment", id: "LIST" }],
    }),
    createAppointment: builder.mutation<Appointment, CreateAppointmentPayload>({
      query: (body) => ({
        url: "/api/v1/client/appointments",
        method: "POST",
        body,
      }),
      transformResponse: (response: AppointmentResponse) => response.appointment,
      invalidatesTags: [{ type: "Appointment", id: "LIST" }, { type: "AppointmentRevenue", id: "SUMMARY" }],
    }),
    updateAppointmentStatus: builder.mutation<
      Appointment,
      {
        id: string;
        status: AppointmentStatus;
        note?: string | null;
        injectionName?: string | null;
        injectionAmount?: number | null;
        operationName?: string | null;
        operationAmount?: number | null;
        feesDiscount?: AppointmentFeeDiscountInput[] | null;
        feeCategory?: AppointmentCategoryFilter;
      }
    >({
      query: ({
        id,
        status,
        note,
        injectionName,
        injectionAmount,
        operationName,
        operationAmount,
        feesDiscount,
        feeCategory,
      }) => ({
        url: `/api/v1/admin/appointments/${id}/status`,
        method: "PATCH",
        body: {
          status,
          ...(note !== undefined ? { note } : {}),
          ...(injectionName !== undefined ? { injectionName } : {}),
          ...(injectionAmount !== undefined ? { injectionAmount } : {}),
          ...(operationName !== undefined ? { operationName } : {}),
          ...(operationAmount !== undefined ? { operationAmount } : {}),
          ...(feesDiscount !== undefined ? { feesDiscount } : {}),
          ...(feeCategory !== undefined ? { feeCategory } : {}),
        },
      }),
      transformResponse: (response: AppointmentResponse) => response.appointment,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointment", id },
        { type: "Appointment", id: "LIST" },
        { type: "AppointmentRevenue", id: "SUMMARY" },
      ],
    }),
    updateAppointmentSerial: builder.mutation<
      Appointment,
      { id: string; modifiedSerialNumber: number | null; reason?: string }
    >({
      query: ({ id, modifiedSerialNumber, reason }) => ({
        url: `/api/v1/admin/appointments/${id}/serial`,
        method: "PATCH",
        body: {
          modifiedSerialNumber,
          ...(reason ? { reason } : {}),
        },
      }),
      transformResponse: (response: AppointmentResponse) => response.appointment,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointment", id },
        { type: "Appointment", id: "LIST" },
      ],
    }),
    deleteAppointment: builder.mutation<
      DeleteMutationResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/v1/admin/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) =>
        _result?.pending
          ? [
              { type: "DeleteRequest", id: "LIST" },
              { type: "Appointment", id: "LIST" },
              { type: "AppointmentRevenue", id: "SUMMARY" },
            ]
          : [
              { type: "Appointment", id },
              { type: "Appointment", id: "LIST" },
              { type: "AppointmentRevenue", id: "SUMMARY" },
            ],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useUpdateAppointmentSerialMutation,
  useDeleteAppointmentMutation,
} = appointmentsApi;
