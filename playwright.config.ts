import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 2 : undefined,

  reporter: 'html',

  use: {
    baseURL:
      process.env.BASE_URL ||
      process.env.BASEURL ||
      'https://qa03.stage.chairlyo.com/',

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    testIdAttribute: 'data-slot',
  },

  projects: [
    // API TESTS
    {
      name: 'api',
      testMatch: '**/branch-api.spec.ts',
      use: {
        baseURL: process.env.API_BASE_URL,
      },
    },

    // UI - CHROMIUM
    {
      name: 'chromium',
      testIgnore: '**/branch-api.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // UI - FIREFOX
    {
      name: 'firefox',
      testIgnore: '**/branch-api.spec.ts',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    // UI - WEBKIT
    {
      name: 'webkit',
      testIgnore: '**/branch-api.spec.ts',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});