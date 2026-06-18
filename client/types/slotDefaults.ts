export type SlotDefaultOption = {
  code: string;
  label: string;
  smsLabel?: string | null;
  startTime: string;
  endTime?: string | null;
  seatLimit: number;
  isActive: boolean;
};

export type SlotDefaultsConfig = {
  siteRef: string;
  defaultSeatLimit: number;
  slots: SlotDefaultOption[];
  updatedAt: string;
};

export type SlotDefaultsResponse = {
  success: boolean;
  data: SlotDefaultsConfig;
  message?: string;
};
