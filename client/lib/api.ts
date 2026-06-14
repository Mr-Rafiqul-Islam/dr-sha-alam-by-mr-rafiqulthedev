export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    ""
  );
}

export function getDefaultDoctorId(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_DOCTOR_ID ?? "";
}
