import type { SiteRef } from "./appointmentSchedule";

export type { SiteRef };

export type SlotDefault = {
  code: string;
  label: string;
  smsLabel?: string | null;
  startTime: string;
  endTime?: string | null;
  seatLimit: number;
  isActive: boolean;
};

export type SlotDefaultsConfig = {
  siteRef: SiteRef;
  defaultSeatLimit: number;
  slots: SlotDefault[];
  updatedAt: string;
};

export type SlotDefaultsPayload = {
  siteRef: SiteRef;
  defaultSeatLimit: number;
  slots: SlotDefault[];
};

export type SlotDefaultsResponse = {
  success: boolean;
  data: SlotDefaultsConfig;
  message?: string;
};
