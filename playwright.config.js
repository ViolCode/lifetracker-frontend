import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

export default defineConfig({
    testDir: "./e2e/tests",

    fullyParallel: false,
    workers: 1,

    retries: 0,

    timeout: 30_000,

    reporter: [
        ["html", { outputFolder: "playwright-report" }]
    ],

    use: {
        baseURL: BASE_URL,

        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",

        credentials: "include",
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],

    webServer: {
        command: "npm run dev:e2e",
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 60_000,
    },
});
