import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

export function envIsTrue(name: string): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}

export function requireNonEmpty(value: string | null | undefined, message: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(message);
  }
  return trimmed;
}

export function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

export type ClientLogger = {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

export function createClientLogger(debug: boolean, prefix: string): ClientLogger {
  const format = (...args: unknown[]) => [prefix, ...args];

  return {
    debug: (...args) => {
      if (debug) {
        console.debug(...format(...args));
      }
    },
    info: (...args) => console.info(...format(...args)),
    warn: (...args) => console.warn(...format(...args)),
    error: (...args) => console.error(...format(...args)),
  };
}

export class HttpClientError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "HttpClientError";
    this.status = status;
    this.body = body;
  }
}

export function createHttpError(
  status: number,
  message: string,
  body?: unknown,
): HttpClientError {
  return new HttpClientError(status, message, body);
}

type CreateAxiosClientParams = {
  baseUrl: string;
  timeout?: number;
  maxBodyLength?: number;
  maxContentLength?: number;
  requireBaseUrl: () => void;
  log: ClientLogger;
};

export function createAxiosClient(params: CreateAxiosClientParams): AxiosInstance {
  const {
    baseUrl,
    timeout = 20000,
    maxBodyLength = Infinity,
    maxContentLength = Infinity,
    requireBaseUrl,
    log,
  } = params;

  const client = axios.create({
    baseURL: baseUrl,
    timeout,
    maxBodyLength,
    maxContentLength,
    validateStatus: () => true,
  });

  client.interceptors.request.use((config) => {
    requireBaseUrl();
    log.debug("request", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      log.debug("response", {
        status: response.status,
        url: response.config.url,
      });
      return response;
    },
    (error: AxiosError) => {
      log.error("network error", error.message);
      return Promise.reject(error);
    },
  );

  return client;
}

export async function postJson<TResponse>(
  client: AxiosInstance,
  url: string,
  body: unknown,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await client.post<TResponse>(url, body, {
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
    },
    ...config,
  });

  if (response.status < 200 || response.status >= 300) {
    throw createHttpError(
      response.status,
      `Request failed with status ${response.status}`,
      response.data,
    );
  }

  return response.data;
}
