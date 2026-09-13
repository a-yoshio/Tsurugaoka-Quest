import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const assetsBaseUrl = loadEnv(mode, ".", "").ASSETS_S3_BASE_URL?.replace(/\/+$/, "");

  return {
    base: assetsBaseUrl ? `${assetsBaseUrl}/assets/image/` : "/",
    plugins: [react()],
  };
});
