import { BUSINESS_TIMEZONE } from "../../utils/bangladeshDate.js";
import { isNovocomConfigured, sendNovocomSms } from "../../lib/novocomSms.js";
import type { PreferredTimeCode } from "./appointment.mapper.js";
import { getPreferredTimeSmsLabel } from "./appointment.mapper.js";

const CHAMBER_SMS_HEADER = `চেম্বার: TruCare Diagnostics Centre
সিদ্দিক টাওয়ার (৫ম তলা, লিফট এর- ৪), ৪৯ মহাখালী, ঢাকা।
(পুরাতন ব্রাক ইউনিভার্সিটির বিপরীত পাশে স্কয়ার ফার্মাসিউটিক্যালস হেড অফিসের পাশের ভবন),`;

const CHAMBER_SMS_FOOTER = `যোগাযোগ: ০৯৬১৩-৬৬৮৮৬৬,০১৭০১৩১৩০০১, ০১৭০১৩১৩০০২
গুগল ম্যাপঃ- https://maps.app.goo.gl/pKnvNaqG8cdvUtrR9?g_st=ic`;

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

const BN_WEEKDAYS: Record<string, string> = {
  Sun: "রবিবার",
  Mon: "সোমবার",
  Tue: "মঙ্গলবার",
  Wed: "বুধবার",
  Thu: "বৃহস্পতিবার",
  Fri: "শুক্রবার",
  Sat: "শনিবার",
};

export type AppointmentSmsPayload = {
  phone: string;
  appointmentDate: Date;
  slotCode: string;
  smsLabel?: string | null;
};

function toBengaliDigits(value: string): string {
  return value.replace(/\d/g, (digit) => BN_DIGITS[Number(digit)] ?? digit);
}

export function formatAttendanceTimeLine(
  appointmentDate: Date,
  smsLabel: string,
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(appointmentDate);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value ?? "";

  const weekday = BN_WEEKDAYS[part("weekday")] ?? part("weekday");
  const date = toBengaliDigits(`${part("day")}/${part("month")}/${part("year")}`);

  return `উপস্থিতি সময়ঃ ${date} রোজ ${weekday} ${smsLabel}।`;
}

export function buildAppointmentSmsMessage({
  appointmentDate,
  slotCode,
  smsLabel,
}: Omit<AppointmentSmsPayload, "phone">): string {
  const resolvedLabel =
    smsLabel ?? getPreferredTimeSmsLabel(slotCode as PreferredTimeCode);

  return `${CHAMBER_SMS_HEADER}
${formatAttendanceTimeLine(appointmentDate, resolvedLabel)}
${CHAMBER_SMS_FOOTER}`;
}

export async function sendAppointmentSms(
  payload: AppointmentSmsPayload,
): Promise<void> {
  if (!isNovocomConfigured()) {
    return;
  }

  await sendNovocomSms({
    phone: payload.phone,
    message: buildAppointmentSmsMessage(payload),
  });
}
