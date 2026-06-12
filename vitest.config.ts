import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "server-only": fileURLToPath(new URL("./tests/mocks/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}", "tests/components/**/*.{test,spec}.{ts,tsx}"],
  },
});
