import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Stage 08 Accessibility Foundation (T002, Category V5)', () => {
  test('verifies axe-core can audit document and passes critical accessibility checks', async ({ page }) => {
    await page.goto('/')
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
