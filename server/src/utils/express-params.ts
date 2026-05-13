/** Express 5 may surface dynamic segments as `string | string[]`. */
export function routeParamString(
  param: string | string[] | undefined,
): string | undefined {
  if (param === undefined) return undefined;
  const v = Array.isArray(param) ? param[0] : param;
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
