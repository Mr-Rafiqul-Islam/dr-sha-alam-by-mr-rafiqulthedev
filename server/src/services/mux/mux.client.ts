import Mux from "@mux/mux-node";

let muxClient: Mux | null = null;

export function getMuxClient(): Mux {
  if (muxClient) return muxClient;

  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  const webhookSecret = process.env.MUX_WEBHOOK_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error("MUX_NOT_CONFIGURED");
  }

  muxClient = new Mux({
    tokenId,
    tokenSecret,
    webhookSecret: webhookSecret ?? undefined,
  });
  return muxClient;
}
