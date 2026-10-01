import { test, expect } from "@playwright/test";

test.describe("User Story 1: Portfolio Orientation to Project 01 Entry & Return (T017)", () => {
  test('redirects root "/" to "#/orientation" and establishes Entry Context', async ({
    page,
  }) => {
    await page.goto("/");

    // Verify hash redirection
    await expect(page).toHaveURL(/.*#\/orientation/);

    // Verify document title synchronization
    await expect(page).toHaveTitle(/Portfolio Orientation/);

    // Verify header identity and absence of unauthorized depth pill (Decision 02 Point 1)
    const headerIdentity = page.locator(".desktop-header-container .identity-name");
    await expect(headerIdentity).toContainText("Adnan Abdullahi");
    await expect(page.locator(".depth-indicator-badge")).toHaveCount(0);
    await expect(page.locator(".project-tag")).toHaveCount(0);
  });

  test('traverses from "#/orientation" to "#/project-01" via primary CTA and returns to "#/orientation"', async ({
    page,
  }) => {
    // 1. Start at Orientation
    await page.goto("/#/orientation");
    await expect(page).toHaveURL(/.*#\/orientation/);

    // Verify Penpot identity in header (Decision 2)
    const headerIdentity = page.locator(
      ".desktop-header-container .identity-name",
    );
    await expect(headerIdentity).toContainText("Adnan Abdullahi");

    // 2. Click primary CTA "Explore the Engineering Record" (Decision 3 & 5)
    const primaryCta = page.getByRole("link", {
      name: "Explore the Engineering Record",
    });
    await expect(primaryCta).toBeVisible();
    await primaryCta.click();

    // 3. Verify forward navigation to Project 01
    await expect(page).toHaveURL(/.*#\/project-01/);
    await expect(page).toHaveTitle(/Project 01 — Portfolio Experience/);

    // Verify Project 01 context label and absence of depth pill (Decision 02 Point 1)
    const contextTag = page.locator(".desktop-header-container .project-tag");
    await expect(contextTag).toHaveText("PROJECT 01");
    await expect(page.locator(".depth-indicator-badge")).toHaveCount(0);

    // Verify Two-Column Layout elements on Project 01 (Decision 4)
    await expect(page.locator(".narrative-column")).toBeVisible();
    await expect(page.locator(".dimensions-column")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Inspect Engineering Approach" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Inspect Engineering Record" }),
    ).toBeVisible();

    // 4. Verify ReturnRail is not rendered (Decision 02 Point 2) and approved in-canvas return action is present
    await expect(page.locator(".return-rail-link")).toHaveCount(0);
    const backBtn = page.getByRole("link", {
      name: "Back to Portfolio Orientation",
    });
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toHaveAttribute("href", "#/orientation");

    // 5. Click approved in-canvas return action to execute contextual return
    await backBtn.click();
    await expect(page).toHaveURL(/.*#\/orientation/);
    await expect(page).toHaveTitle(/Portfolio Orientation/);
  });

  test('verifies secondary action "View Engineering Approach" on Orientation (Decision 04)', async ({
    page,
  }) => {
    await page.goto("/#/orientation");
    const secondaryBtn = page.getByRole("link", {
      name: "View Engineering Approach",
    });
    await expect(secondaryBtn).toBeVisible();
    await expect(secondaryBtn).toHaveAttribute("href", "#/approach");

    // Capture screenshot for visual inspection of Decision 04 button treatment
    await page.screenshot({
      path: "C:/Users/ADMIN/.gemini/antigravity/brain/1218db9a-ff86-4fe9-b15a-4b4c76f01945/orientation-decision04-desktop.png",
    });

    await secondaryBtn.click();
    await expect(page).toHaveURL(/.*#\/approach/);
    await expect(page).toHaveTitle(/Engineering Approach/);
  });
});
