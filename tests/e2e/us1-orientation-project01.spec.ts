import { test, expect } from '@playwright/test'

test.describe('User Story 1: Portfolio Orientation to Project 01 Entry & Return (T017)', () => {
  test('redirects root "/" to "#/orientation" and establishes Entry Context', async ({ page }) => {
    await page.goto('/')

    // Verify hash redirection
    await expect(page).toHaveURL(/.*#\/orientation/)

    // Verify document title synchronization
    await expect(page).toHaveTitle(/Portfolio Orientation/)

    // Verify depth badge in header displays Entry Context
    const depthBadge = page.locator('.app-header-landmark')
    await expect(depthBadge).toContainText('Entry Context')
  })

  test('traverses from "#/orientation" to "#/project-01" via primary CTA and returns to "#/orientation"', async ({ page }) => {
    // 1. Start at Orientation
    await page.goto('/#/orientation')
    await expect(page).toHaveURL(/.*#\/orientation/)

    // Verify Penpot identity in header (Decision 2)
    const headerIdentity = page.locator('.desktop-header-container .identity-name')
    await expect(headerIdentity).toContainText('Adnan Abdullahi')

    // 2. Click primary CTA "Explore the Engineering Record" (Decision 3 & 5)
    const primaryCta = page.getByRole('link', { name: 'Explore the Engineering Record' })
    await expect(primaryCta).toBeVisible()
    await primaryCta.click()

    // 3. Verify forward navigation to Project 01
    await expect(page).toHaveURL(/.*#\/project-01/)
    await expect(page).toHaveTitle(/Project 01 — Portfolio Experience/)

    // Verify Project Context depth indicator
    const header = page.locator('.app-header-landmark')
    await expect(header).toContainText('Project Context')

    // Verify Two-Column Layout elements on Project 01 (Decision 4)
    await expect(page.locator('.narrative-column')).toBeVisible()
    await expect(page.locator('.dimensions-column')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Inspect Engineering Approach' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Inspect Engineering Record' })).toBeVisible()

    // 4. Verify Return Rail is present on Project 01 and links back to Orientation
    const returnRail = page.locator('.return-rail-link')
    await expect(returnRail).toBeVisible()
    await expect(returnRail).toHaveAttribute('href', '#/orientation')
    await expect(returnRail).toContainText('Return to Portfolio Orientation')

    // 5. Click return rail to execute contextual return
    await returnRail.click()
    await expect(page).toHaveURL(/.*#\/orientation/)
    await expect(page).toHaveTitle(/Portfolio Orientation/)
  })
})

