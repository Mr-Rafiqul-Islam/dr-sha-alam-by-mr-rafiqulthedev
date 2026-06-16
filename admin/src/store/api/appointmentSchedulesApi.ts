import type {
  AppointmentSchedule,
  AppointmentSchedulePayload,
  AppointmentScheduleResponse,
  AppointmentSchedulesListResponse,
  DeleteAppointmentScheduleResponse,
} from "../../types/appointmentSchedule";
import { baseApi } from "./baseApi";

export const appointmentSchedulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointmentSchedules: builder.query<AppointmentSchedule[], void>({
      query: () => "/api/v1/admin/appointment-schedules",
      transformResponse: (response: AppointmentSchedulesListResponse) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AppointmentSchedule" as const,
                id,
              })),
              { type: "AppointmentSchedule", id: "LIST" },
            ]
          : [{ type: "AppointmentSchedule", id: "LIST" }],
    }),
    getAppointmentScheduleById: builder.query<AppointmentSchedule, string>({
      query: (id) => `/api/v1/admin/appointment-schedules/${id}`,
      transformResponse: (response: AppointmentScheduleResponse) => response.data,
      providesTags: (_result, _error, id) => [
        { type: "AppointmentSchedule", id },
      ],
    }),
    createAppointmentSchedule: builder.mutation<
      AppointmentSchedule,
      AppointmentSchedulePayload
    >({
      query: (body) => ({
        url: "/api/v1/admin/appointment-schedules",
        method: "POST",
        body,
      }),
      transformResponse: (response: AppointmentScheduleResponse) => response.data,
      invalidatesTags: [{ type: "AppointmentSchedule", id: "LIST" }],
    }),
    updateAppointmentSchedule: builder.mutation<
      AppointmentSchedule,
      { id: string; body: AppointmentSchedulePayload }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/admin/appointment-schedules/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: AppointmentScheduleResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AppointmentSchedule", id },
        { type: "AppointmentSchedule", id: "LIST" },
      ],
    }),
    deleteAppointmentSchedule: builder.mutation<
      DeleteAppointmentScheduleResponse,
      string
    >({
      query: (id) => ({
        url: `/api/v1/admin/appointment-schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AppointmentSchedule", id },
        { type: "AppointmentSchedule", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateAppointmentScheduleMutation,
  useDeleteAppointmentScheduleMutation,
  useGetAppointmentScheduleByIdQuery,
  useGetAppointmentSchedulesQuery,
  useUpdateAppointmentScheduleMutation,
} = appointmentSchedulesApi;
