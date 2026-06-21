import NodeCache from "node-cache";
import { prisma } from "../../config/db.js";

const CAPI_CONFIG_CACHE_KEY = "capi_config";
const capiConfigCache = new NodeCache({ stdTTL: 300 });

export type AnalyticsSettingInput = {
  pixelId?: string | null;
  accessToken?: string | null;
  testEventCode?: string | null;
  enabled?: boolean;
};

export type CapiConfig = {
  pixelId: string | null;
  accessToken: string | null;
  testEventCode: string | null;
  enabled: boolean;
};

export function invalidateCapiConfigCache(): void {
  capiConfigCache.del(CAPI_CONFIG_CACHE_KEY);
}

export async function getAnalyticsSetting() {
  return prisma.analyticsSetting.findFirst({
    where: { isSingleton: true },
  });
}

export async function upsertAnalyticsSetting(input: AnalyticsSettingInput) {
  const data: {
    pixelId?: string | null;
    testEventCode?: string | null;
    enabled?: boolean;
    accessToken?: string;
  } = {
    pixelId: input.pixelId?.trim() || null,
    testEventCode: input.testEventCode?.trim() || null,
    enabled: input.enabled ?? false,
  };

  const accessToken = input.accessToken?.trim();
  if (accessToken) {
    data.accessToken = accessToken;
  }

  const setting = await prisma.analyticsSetting.upsert({
    where: { isSingleton: true },
    create: {
      isSingleton: true,
      ...data,
    },
    update: data,
  });

  invalidateCapiConfigCache();
  return setting;
}

export async function getCapiConfig(): Promise<CapiConfig> {
  const cached = capiConfigCache.get<CapiConfig>(CAPI_CONFIG_CACHE_KEY);
  if (cached) {
    return cached;
  }

  const setting = await getAnalyticsSetting();
  const config: CapiConfig = {
    pixelId: setting?.pixelId ?? null,
    accessToken: setting?.accessToken ?? null,
    testEventCode: setting?.testEventCode ?? null,
    enabled: setting?.enabled ?? false,
  };

  capiConfigCache.set(CAPI_CONFIG_CACHE_KEY, config);
  return config;
}

export async function getClientAnalyticsConfig() {
  const setting = await getAnalyticsSetting();
  return {
    pixelId: setting?.pixelId ?? null,
    enabled: setting?.enabled ?? false,
  };
}
