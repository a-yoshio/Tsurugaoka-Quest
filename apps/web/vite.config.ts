import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cp, rm } from "node:fs/promises";
import { resolve } from "node:path";

export default defineConfig(() => {
  return {
    base: "/",
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
