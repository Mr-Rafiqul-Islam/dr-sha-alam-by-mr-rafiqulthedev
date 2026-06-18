export const BOOTSTRAP_DEFAULT_SEAT_LIMIT = 50;

export type BootstrapSlotDefault = {
  code: string;
  label: string;
  smsLabel: string;
  startTime: string;
  endTime: string | null;
  seatLimit: number;
  isActive: boolean;
};

export const BOOTSTRAP_SLOT_DEFAULTS: BootstrapSlotDefault[] = [
  {
    code: "P-9",
    label: "PLID (Present at - 9:00 AM)",
    smsLabel: "সকাল ৯ টা",
    startTime: "09:00",
    endTime: "10:00",
    seatLimit: 20,
    isActive: true,
  },
  {
    code: "OP-4",
    label: "Old PLID (Present at - 4:00 PM)",
    smsLabel: "বিকাল ৪ টা",
    startTime: "16:00",
    endTime: "17:00",
    seatLimit: 15,
    isActive: true,
  },
  {
    code: "G-5",
    label: "General Patient (Present at - 5:00 PM)",
    smsLabel: "বিকাল ৫ টা",
    startTime: "17:00",
    endTime: "18:00",
    seatLimit: 10,
    isActive: true,
  },
];
