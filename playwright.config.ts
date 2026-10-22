import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:4183",
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4183 --strictPort",
    url: "http://127.0.0.1:4183",
    env: { VITE_API_URL: "/api" },
    reuseExistingServer: false,
  },
});
