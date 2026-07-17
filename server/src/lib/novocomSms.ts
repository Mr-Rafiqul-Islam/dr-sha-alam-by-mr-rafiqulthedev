/**
 * Normalizes a Bangladeshi phone number to the international MSISDN format
 * (e.g. "01618574590" -> "8801618574590") expected by the Novocom gateway.
 * Local-format numbers are accepted by the API but are not actually delivered.
 */
export function normalizeBdPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  if (digits.startsWith("880")) {
    return digits;
  }
  if (digits.startsWith("0")) {
    return `880${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Thin shared client for the Novocom SMS gateway already used by appointment confirmations.
 */
export async function sendNovocomSms(params: {
  phone: string;
  message: string;
}): Promise<{ httpStatus: number; bodyPreview: string }> {
  const apiKey = process.env.NOVOCOM_API_KEY?.trim();
  const clientId = process.env.NOVOCOM_CLIENT_ID?.trim();
  const senderId = process.env.NOVOCOM_SENDER_ID?.trim();

  if (!apiKey || !clientId || !senderId) {
    throw new Error("Novocom SMS is not configured");
  }

  const phone = normalizeBdPhone(params.phone.trim());
  if (!phone) {
    throw new Error("Phone number is required for SMS");
  }

  const url =
    `https://sms.novocom-bd.com/api/v2/SendSMS?` +
    `ApiKey=${encodeURIComponent(apiKey)}&ClientId=${encodeURIComponent(clientId)}` +
    `&SenderId=${encodeURIComponent(senderId)}` +
    `&Message=${encodeURIComponent(params.message)}` +
    `&MobileNumbers=${encodeURIComponent(phone)}&Is_Unicode=True`;

  const response = await fetch(url);
  const bodyText = await response.text();
  const bodyPreview = bodyText.slice(0, 200);

  if (!response.ok) {
    throw new Error(
      `SMS gateway responded with ${response.status}: ${bodyPreview}`,
    );
  }

  // Novocom often returns HTTP 200 with an ErrorCode in JSON body.
  try {
    const parsed = JSON.parse(bodyText) as {
      ErrorCode?: number | string;
      ErrorDescription?: string;
    };
    const errorCode = parsed.ErrorCode;
    if (
      errorCode !== undefined &&
      errorCode !== null &&
      String(errorCode) !== "0"
    ) {
      throw new Error(
        `SMS gateway ErrorCode=${String(errorCode)} ${parsed.ErrorDescription ?? ""}`.trim(),
      );
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Non-JSON success body — treat HTTP 200 as accepted.
      return { httpStatus: response.status, bodyPreview };
    }
    throw error;
  }

  return { httpStatus: response.status, bodyPreview };
}

export function isNovocomConfigured(): boolean {
  return Boolean(
    process.env.NOVOCOM_API_KEY?.trim() &&
      process.env.NOVOCOM_CLIENT_ID?.trim() &&
      process.env.NOVOCOM_SENDER_ID?.trim(),
  );
}
