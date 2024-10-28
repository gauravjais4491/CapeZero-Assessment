import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 */
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 80 * 10 * 10 * 10,
  expect: { timeout: 10 * 10 * 100 },
  reporter: [['html', { outputFolder: 'html-report', open: 'never' }], ['list'], ["allure-playwright"]],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: true,
    acceptDownloads: true,
    storageState: './LoginAuthCQ.json',
  },

  projects: [
    {
      name: 'loginTests',
      testMatch: /login\.ts/,
    },

    {
      name: 'Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['loginTests']
    },
  ]
});
