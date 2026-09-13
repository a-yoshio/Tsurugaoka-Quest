import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { cp, rm } from "node:fs/promises";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  const assetsBaseUrl = loadEnv(mode, ".", "").ASSETS_S3_BASE_URL?.replace(/\/+$/, "");

  return {
    base: assetsBaseUrl ? `${assetsBaseUrl}/assets/image/` : "/",
    plugins: [react()],
    build: {
      rollupOptions: {
        plugins: [
          {
            name: "copy-public-image-to-assets",
            apply: "build",
            async closeBundle() {
              await rm(resolve("dist/image"), { recursive: true, force: true });
              await cp(
                resolve("public/image"),
                resolve("dist/assets/image"),
                { recursive: true },
              );
            },
          },
        ],
      },
    },
  };
});
