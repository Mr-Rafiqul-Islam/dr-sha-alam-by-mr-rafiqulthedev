export type ScheduleStatus = "ACTIVE" | "INACTIVE";

export type SiteRef = "DOCTOR_SHA_ALAM" | "TRUE_CARE_HELLING_CENTER";

export type AppointmentSchedule = {
  id: string;
  siteRef: SiteRef;
  status: ScheduleStatus;
  title?: string | null;
  date: string;
  isClosed: boolean;
  slots: unknown[];
  createdAt: string;
  updatedAt: string;
};

export type AppointmentSchedulesListResponse = {
  success: boolean;
  data: AppointmentSchedule[];
  message?: string;
};
