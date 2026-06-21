import { cookies } from "next/headers";

export async function getMetaCookiesFromHeaders(): Promise<{
  fbc?: string;
  fbp?: string;
}> {
  const cookieStore = await cookies();
  const fbc = cookieStore.get("_fbc")?.value;
  const fbp = cookieStore.get("_fbp")?.value;

  return {
    ...(fbc ? { fbc } : {}),
    ...(fbp ? { fbp } : {}),
  };
}
