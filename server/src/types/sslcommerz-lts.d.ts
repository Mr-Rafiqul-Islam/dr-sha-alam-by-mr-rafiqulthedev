declare module "sslcommerz-lts" {
  interface SSLCommerzInitResponse {
    GatewayPageURL?: string;
    [key: string]: unknown;
  }

  export default class SSLCommerzPayment {
    constructor(storeId?: string, storePassword?: string, live?: boolean);

    init(
      data: Record<string, unknown>,
      url?: string | false,
      method?: string
    ): Promise<SSLCommerzInitResponse>;

    validate(
      data: Record<string, unknown>,
      url?: string | false,
      method?: string
    ): Promise<Record<string, unknown>>;

    initiateRefund(
      data: Record<string, unknown>,
      url?: string | false,
      method?: string
    ): Promise<Record<string, unknown>>;

    refundQuery(
      data: Record<string, unknown>,
      url?: string | false,
      method?: string
    ): Promise<Record<string, unknown>>;

    transactionQueryBySessionId(
      data: Record<string, unknown>,
      url?: string | false,
      method?: string
    ): Promise<Record<string, unknown>>;

    transactionQueryByTransactionId(
      data: Record<string, unknown>,
      url?: string | false,
      method?: string
    ): Promise<Record<string, unknown>>;
  }
}
