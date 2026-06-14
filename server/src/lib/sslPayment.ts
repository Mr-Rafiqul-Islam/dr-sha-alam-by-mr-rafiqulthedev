

export const validateSSLPayment = async (valId: string) => {
  const isLive = process.env.SSL_IS_LIVE === "true";

  const baseURL = isLive
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";

  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

  if (!storeId || !storePassword) {
    throw new Error("SSLCommerz credentials are not configured");
  }

  const url =
    `${baseURL}/validator/api/validationserverAPI.php?` +
    `val_id=${encodeURIComponent(valId)}` +
    `&store_id=${encodeURIComponent(storeId)}` +
    `&store_passwd=${encodeURIComponent(storePassword)}` +
    `&v=1&format=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Validation API error: ${response.status}`);
    }

    const data = await response.json();

    console.log(`Payment Validation ${isLive ? "Production" : "Sandbox"}:`, {
      valId,
      status: data.status,
      tran_id: data.tran_id,
      amount: data.amount,
    });

    return data;
  } catch (error) {
    console.error("Validation Error:", error);
    throw error;
  }
};
