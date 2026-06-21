type FbqWindow = Window & {
  fbq?: (
    command: string,
    eventName: string,
    params?: Record<string, unknown>,
    options?: { eventID?: string },
  ) => void;
};

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const fbq = (window as FbqWindow).fbq;
  if (!fbq) {
    return;
  }

  if (eventId) {
    fbq("track", eventName, params ?? {}, { eventID: eventId });
    return;
  }

  fbq("track", eventName, params ?? {});
}

export function getMetaCookiesFromDocument(): {
  fbc?: string;
  fbp?: string;
} {
  if (typeof document === "undefined") {
    return {};
  }

  const cookies = document.cookie.split(";").reduce<Record<string, string>>(
    (acc, part) => {
      const [key, ...rest] = part.trim().split("=");
      if (key) {
        acc[key] = decodeURIComponent(rest.join("="));
      }
      return acc;
    },
    {},
  );

  return {
    fbc: cookies._fbc,
    fbp: cookies._fbp,
  };
}
