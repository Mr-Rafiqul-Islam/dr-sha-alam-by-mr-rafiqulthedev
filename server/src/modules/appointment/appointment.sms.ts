import type { PreferredTimeCode } from "./appointment.mapper.js";
import { getPreferredTimeSmsLabel } from "./appointment.mapper.js";
import { isNovocomConfigured, sendNovocomSms } from "../../lib/novocomSms.js";

const CHAMBER_SMS_FOOTER = `চেম্বার: TruCare Healing Centre
সিদ্দিক টাওয়ার (৫ম তলা, লিফট এর- ৪), ৪৯ মহাখালী, ঢাকা।
(স্কয়ার ফার্মাসিউটিক্যালস হেড অফিসের পাশের ভবন)`;

const CHAMBER_SMS_CONTACT = "যোগাযোগ: ০৯৬১৩-৬৬৮৮৬৬, ০১৭০১ ৩১৩০০১-০২";

type AppointmentSmsPayload = {
  name: string;
  phone: string;
  serialNumber: number;
  slotCode: string;
  smsLabel?: string | null;
};

function buildAppointmentSmsMessage({
  name,
  serialNumber,
  slotCode,
  smsLabel,
}: Omit<AppointmentSmsPayload, "phone">): string {
  const resolvedLabel =
    smsLabel ??
    getPreferredTimeSmsLabel(slotCode as PreferredTimeCode);

  return `${CHAMBER_SMS_FOOTER}

রোগীর নাম: ${name}
আপনার সিরিয়াল নং: ${serialNumber}
উপস্থিতি সময়ঃ ${resolvedLabel}

${CHAMBER_SMS_CONTACT}`;
}

export async function sendAppointmentSms(payload: AppointmentSmsPayload): Promise<void> {
  if (!isNovocomConfigured()) {
    return;
  }

  await sendNovocomSms({
    phone: payload.phone,
    message: buildAppointmentSmsMessage(payload),
  });
}
