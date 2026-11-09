import { defineConfig, devices } from "@playwright/test"

// Tests de bout en bout : un vrai navigateur, le vrai front et la vraie API.
// Si `bun run dev:front` et `bun run dev:back` tournent déjà, Playwright les réutilise.
export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    actionTimeout: 5000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "bun run dev:back",
      url: "http://localhost:3001/api/parcours",
      reuseExistingServer: true,
    },
    {
      command: "bun run dev:front",
      url: "http://localhost:3000",
      reuseExistingServer: true,
    },
  ],
})
