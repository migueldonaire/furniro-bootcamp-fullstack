/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }, // shop on 5173
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    // RTK Query needs a full URL. In the tests nobody answers there: we fake fetch
    env: { VITE_API_URL: "http://localhost:3000/api/v1" },
    coverage: { reporter: ["text", "lcov"] }, // lcov for SonarQube Cloud
  },
});
