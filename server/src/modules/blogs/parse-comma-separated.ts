/**
 * Parses comma-separated strings or string arrays into a trimmed non-empty list.
 */
export function parseCommaSeparatedField(
  raw: unknown,
  label: string,
): { ok: true; values: string[] } | { ok: false; message: string } {
  if (raw === undefined || raw === null) {
    return { ok: false, message: `${label} is required` };
  }

  let parts: string[];

  if (Array.isArray(raw)) {
    parts = raw.map((value) => String(value).trim());
  } else {
    parts = String(raw)
      .split(",")
      .map((value) => value.trim());
  }

  const values = parts.filter(Boolean);
  if (!values.length) {
    return { ok: false, message: `${label} cannot be empty` };
  }

  return { ok: true, values };
}
