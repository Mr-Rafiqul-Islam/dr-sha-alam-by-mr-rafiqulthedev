import type { PreferredTimeCode } from "./appointment.mapper.js";
import { getPreferredTimeSmsLabel } from "./appointment.mapper.js";
import { getEffectiveSerialNumber } from "./appointment.serial.js";

const CHAMBER_SMS_FOOTER = `চেম্বার: TruCare Healing Centre
সিদ্দিক টাওয়ার (৫ম তলা, লিফট এর- ৪), ৪৯ মহাখালী, ঢাকা।
(স্কয়ার ফার্মাসিউটিক্যালস হেড অফিসের পাশের ভবন)`;

const CHAMBER_SMS_CONTACT = "যোগাযোগ: ০৯৬১৩-৬৬৮৮৬৬, ০১৭০১ ৩১৩০০১-০২";

type AppointmentSmsPayload = {
  name: string;
  phone: string;
  serialNumber: number;
  modifiedSerialNumber?: number | null;
  slotCode: string;
  smsLabel?: string | null;
};

function buildAppointmentSmsMessage({
  name,
  serialNumber,
  modifiedSerialNumber,
  slotCode,
  smsLabel,
}: Omit<AppointmentSmsPayload, "phone">): string {
  const resolvedLabel =
    smsLabel ??
    getPreferredTimeSmsLabel(slotCode as PreferredTimeCode);

  const effectiveSerial = getEffectiveSerialNumber({
    serialNumber,
    modifiedSerialNumber,
  });

  return `${CHAMBER_SMS_FOOTER}

রোগীর নাম: ${name}
আপনার সিরিয়াল নং: ${effectiveSerial}
উপস্থিতি সময়ঃ ${resolvedLabel}

${CHAMBER_SMS_CONTACT}`;
}

export async function sendAppointmentSms(payload: AppointmentSmsPayload): Promise<void> {
  const apiKey = process.env.NOVOCOM_API_KEY;
  const clientId = process.env.NOVOCOM_CLIENT_ID;
  const senderId = process.env.NOVOCOM_SENDER_ID;

  if (!apiKey || !clientId || !senderId) {
    return;
  }

  const message = encodeURIComponent(buildAppointmentSmsMessage(payload));
  const mobileNumbers = encodeURIComponent(payload.phone);

  const url =
    `https://sms.novocom-bd.com/api/v2/SendSMS?` +
    `ApiKey=${encodeURIComponent(apiKey)}&ClientId=${encodeURIComponent(clientId)}` +
    `&SenderId=${encodeURIComponent(senderId)}` +
    `&Message=${message}&MobileNumbers=${mobileNumbers}&Is_Unicode=True`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SMS gateway responded with ${response.status}`);
  }
}
