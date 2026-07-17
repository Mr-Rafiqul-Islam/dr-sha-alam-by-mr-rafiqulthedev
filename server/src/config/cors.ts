import type { CorsOptions } from "cors";

function parseExtraOrigins(value: string | undefined): string[] {
  if (!value?.trim()) {
    return [];
  }
  return value.split(",").map((entry) => entry.trim()).filter(Boolean);
}

const allowedOrigins = [
  "https://admin.doctorshahalam.com",
  "https://doctorshahalam.com",
  "https://doctorshahalam.com",
  "https://admin.trucarehealingcentre.com",
  "https://www.doctorshahalam.com",
  "https://sandbox.sslcommerz.com",
  "https://securepay.sslcommerz.com",
  "https://interpolative-multicoil-lowell.ngrok-free.dev",
  "https://localhost:3000 ",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
  ...parseExtraOrigins(process.env.CORS_ALLOWED_ORIGINS),
].filter((origin): origin is string => Boolean(origin));

const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || uniqueAllowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Allow the request through without CORS headers (payment redirects, IPN, etc.).
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma",
  ],
  credentials: true,
};
