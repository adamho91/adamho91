import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@fal-slides/brand": path.resolve(root, "../../packages/brand"),
      "@fal-slides/dust-engine": path.resolve(root, "../../packages/dust-engine/src"),
      "@brand": path.resolve(root, "../../packages/brand"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
