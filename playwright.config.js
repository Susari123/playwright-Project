// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './Tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: 1,
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    baseURL: 'https://darwinapi.edvak.com',
  },
  reporter: 'html',
});
