import { prisma } from "../../config/db.js";

export type PaymentSettingInput = {
  bkashMerchantQrUrl?: string | null;
  bkashMerchantQrPublicId?: string | null;
};

export async function getPaymentSetting() {
  return prisma.paymentSetting.findFirst({
    where: { isSingleton: true },
  });
}

export async function upsertPaymentSetting(input: PaymentSettingInput) {
  const data = {
    bkashMerchantQrUrl: input.bkashMerchantQrUrl?.trim() || null,
    bkashMerchantQrPublicId: input.bkashMerchantQrPublicId?.trim() || null,
  };

  return prisma.paymentSetting.upsert({
    where: { isSingleton: true },
    create: {
      isSingleton: true,
      ...data,
    },
    update: data,
  });
}
