import type {
  Appointment,
  AppointmentResponse,
  AppointmentsListResponse,
  AppointmentStatus,
  CreateAppointmentPayload,
} from "../../types/appointment";
import type { DeleteMutationResponse } from "../../types/deleteRequest";
import { baseApi } from "./baseApi";

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query<Appointment[], void>({
      query: () => "/api/v1/admin/appointments",
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
      { id: string; status: AppointmentStatus; note?: string | null; injectionName?: string | null; injectionAmount?: number | null }
    >({
      query: ({ id, status, note, injectionName, injectionAmount }) => ({
        url: `/api/v1/admin/appointments/${id}/status`,
        method: "PATCH",
        body: {
          status,
          ...(note !== undefined ? { note } : {}),
          ...(Object.prototype.hasOwnProperty.call({ injectionName }, 'injectionName') ? { injectionName } : {}),
          ...(Object.prototype.hasOwnProperty.call({ injectionAmount }, 'injectionAmount') ? { injectionAmount } : {}),
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
