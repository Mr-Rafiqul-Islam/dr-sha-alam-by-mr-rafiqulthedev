const bdtFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatBdtCurrency(value: number): string {
  if (!Number.isFinite(value)) {
    return bdtFormatter.format(0);
  }
  return bdtFormatter.format(value);
}

export function formatAttendanceRate(value: number): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  return `${value.toFixed(2)}%`;
}
