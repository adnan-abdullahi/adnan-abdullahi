import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for Project 01 — Portfolio Experience.
 * Configured per quickstart.md and T002 to verify:
 * - Desktop baseline (1440px)
 * - Tablet (768px - 1024px)
 * - Mobile (< 768px, 375px baseline)
 */
export default defineConfig({
  testDir: './tests',
  testMatch: ['**/e2e/**/*.spec.ts', '**/a11y/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 840 } // Approved Stage 04 baseline
      }
    },
    {
      name: 'tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 }
      }
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 375, height: 667 }
      }
    }
  ],
  webServer: {
    command: 'npm.cmd --prefix app run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
})
