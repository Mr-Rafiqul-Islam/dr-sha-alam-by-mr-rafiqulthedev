import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devApiProxyTarget =
    env.VITE_DEV_API_PROXY?.trim() || "http://localhost:5002";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      dedupe: ["react", "react-dom", "react/jsx-runtime"],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router", "react-router/dom"],
    },
    server: {
      host: "localhost",
      port: 5173,
      strictPort: true,
      hmr: {
        host: "localhost",
        port: 5173,
        clientPort: 5173,
      },
      allowedHosts: [
        "admin.trucarehealingcentre.com",
        "admin.trucaredev.tech",
      ],
      proxy: {
        "/api": {
          target: devApiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
