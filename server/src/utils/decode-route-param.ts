/** Decode percent-encoded route params (handles double-encoding from clients). */
export function decodeRouteParam(value: string): string {
  let decoded = value.trim();
  for (let i = 0; i < 3; i++) {
    if (!/%[0-9A-Fa-f]{2}/.test(decoded)) {
      break;
    }
    try {
      const next = decodeURIComponent(decoded.replace(/\+/g, " "));
      if (next === decoded) {
        break;
      }
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}
