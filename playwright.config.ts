import { defineConfig, devices } from '@playwright/test';

/*
This file loads first before any other file, hence process.env is already populated by the time other files are read 
 
dotenv loads key-value pairs of .env file we passed, to the process.env.
And since config.ts is loaded first, that process.env is available everywhere

Why __dirname?
Without it, dotenv.config() defaults to looking for Secrets.env in process.cwd().
It breaks if you ever run Playwright from a different working directory (e.g.  a CI job that cds elsewhere).
__dirname makes it location-independent and anchors the path.
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, 'Secrets.env') }); /* c:\LEARNING_REPOS\PlaywrightFrameworkDesign\Secrets.env */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({

  /* directory where your test files are located */
  testDir: './tests',     
  
  /* Only files ending with .spec.ts will be considered as test files */
  testMatch: '**/*.spec.ts', 

  /* Maximum duration for each test, in milliseconds */
  timeout: 20 * 60 * 1000,

  /* Default timeout for expect() assertions, in milliseconds */
  expect: {
    timeout: 60 * 1000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://practicesoftwaretesting.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      /* Runs tests/auth.setup.ts once per run: logs in, saves storageState to .auth/*.json */
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      /* Only spec files under tests/stable/** */
      name: 'stable',
      testMatch: '**/stable/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      fullyParallel: true,
    },

    {
      /* Authenticated contexts are created per-test by tests/fixtures.ts (adminPage), not here */
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
