export type ScheduleStatus = "ACTIVE" | "INACTIVE";

export type SiteRef = "DOCTOR_SHA_ALAM" | "TRUE_CARE_HELLING_CENTER";

export type AppointmentSlot = {
  id?: string;
  scheduleId?: string;
  code: string;
  label: string;
  smsLabel?: string | null;
  startTime: string;
  endTime?: string | null;
  seatLimit: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AppointmentSchedule = {
  id: string;
  siteRef: SiteRef;
  status: ScheduleStatus;
  title?: string | null;
  date: string;
  isClosed: boolean;
  slots: AppointmentSlot[];
  createdAt: string;
  updatedAt: string;
};

export type AppointmentSchedulePayload = {
  date: string;
  title?: string | null;
  siteRef: SiteRef;
  status: ScheduleStatus;
  isClosed: boolean;
  slots: Array<{
    code: string;
    label: string;
    smsLabel?: string | null;
    startTime: string;
    endTime?: string | null;
    seatLimit: number;
    isActive: boolean;
  }>;
};

export type AppointmentSchedulesListResponse = {
  success: boolean;
  data: AppointmentSchedule[];
};

export type AppointmentScheduleResponse = {
  success: boolean;
  data: AppointmentSchedule;
  message?: string;
};

export type DeleteAppointmentScheduleResponse = {
  success: boolean;
  message: string;
};
