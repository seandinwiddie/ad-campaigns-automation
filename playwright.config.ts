import { defineConfig, devices } from '@playwright/test';

const testHost = '127.0.0.1';
const testPort = Number(process.env.PLAYWRIGHT_PORT ?? 3001);
const defaultBaseURL = `http://${testHost}:${testPort}`;
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL ?? defaultBaseURL;

export default defineConfig({
  testDir: './__tests__',
  testMatch: '**/*.e2e.test.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: `npm run dev -- --hostname ${testHost} --port ${testPort}`,
        url: defaultBaseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
