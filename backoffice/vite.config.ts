/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: { port: 5174 }, // backoffice on 5174, so it can run at the same time as the shop
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    // RTK Query needs a full URL. In the tests nobody answers there: we fake fetch
    env: { VITE_API_URL: "http://localhost:3000/api/v1" },
    coverage: { reporter: ["text", "lcov"] }, // lcov for SonarQube Cloud
  },
});
