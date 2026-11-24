/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }, // shop on 5173
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: { reporter: ["text", "lcov"] }, // lcov for SonarQube Cloud
  },
});
