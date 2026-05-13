/** Integer in [min, max] or null when invalid / non-integer. */
export function parseIntInRange(
  raw: unknown,
  min: number,
  max: number,
): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

export function parseRating(raw: unknown): number | null {
  return parseIntInRange(raw, 1, 5);
}

export function parseAge(raw: unknown): number | null {
  return parseIntInRange(raw, 0, 150);
}

export function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x).trim()).filter(Boolean);
}

export function parseOptionalUuid(raw: unknown): string | undefined {
  if (raw == null || raw === "") return undefined;
  const s = String(raw).trim();
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      s,
    )
  ) {
    return s;
  }
  return undefined;
}
