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
    isMobile,
  }) => {
    // 1. Start at Orientation
    await page.goto("/#/orientation");
    await expect(page).toHaveURL(/.*#\/orientation/);

    // Verify identity in header
    if (!isMobile) {
      const headerIdentity = page.locator(
        ".desktop-header-container .identity-name",
      );
      await expect(headerIdentity).toContainText("Adnan Abdullahi");
    } else {
      const mobileIdentity = page.locator(
        ".mobile-nav-container .mobile-identity-name",
      );
      await expect(mobileIdentity).toContainText("Adnan Abdullahi");
    }

    // 2. Click primary CTA "Explore the Portfolio Project" (Requirement F.1)
    const primaryCta = page.getByRole("link", {
      name: "Explore the Portfolio Project",
    });
    await expect(primaryCta).toBeVisible();
    await primaryCta.click();

    // 3. Verify forward navigation to Project 01
    await expect(page).toHaveURL(/.*#\/project-01/);
    await expect(page).toHaveTitle(/Project 01 — Portfolio Experience/);

    // Verify absence of context label and absence of depth pill
    await expect(page.locator(".project-tag")).toHaveCount(0);
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

    // 4. Verify ReturnRail and in-canvas return button are not rendered on Project 01
    await expect(page.locator(".return-rail-link")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Back to Portfolio Orientation" }),
    ).toHaveCount(0);

    // 5. Verify distinct primary/secondary action hierarchy on Project 01
    const approachLink = page.getByRole("link", {
      name: "Inspect Engineering Approach",
    });
    await expect(approachLink).toHaveClass(/action-btn--primary/);

    const recordLink = page.getByRole("link", {
      name: "Inspect Engineering Record",
    });
    await expect(recordLink).toHaveClass(/action-btn--secondary|action-btn--accent/);

    // 6. Return to Orientation via shared header / mobile navigation
    if (isMobile) {
      await page.locator(".mobile-hamburger-btn").click();
      const homeLink = page
        .locator("#mobile-nav-drawer")
        .getByRole("link", { name: "Home" });
      await homeLink.click();
    } else {
      const homeLink = page
        .locator(".desktop-header-container")
        .getByRole("link", { name: "Home", exact: true });
      await homeLink.click();
    }
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

  test("mobile navigation drawer opens, displays visible heading 'Menu', and closes on resize to desktop", async ({
    page,
  }) => {
    // 1. Establish mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/#/orientation");

    // 2. Open drawer via mobile hamburger button
    const hamburger = page.locator(".mobile-hamburger-btn");
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    const drawer = page.locator("#mobile-nav-drawer");
    await expect(drawer).toBeVisible();

    // 3. Verify visible heading displays "Menu" (Change A)
    const title = drawer.locator(".mobile-drawer-title");
    await expect(title).toHaveText("Menu");

    // 4. Resize viewport to desktop width >= 768px (Change B)
    await page.setViewportSize({ width: 1024, height: 768 });

    // Drawer must be closed
    await expect(drawer).not.toBeVisible();

    // 5. Resize back to mobile width < 768px (Change B)
    await page.setViewportSize({ width: 375, height: 667 });

    // Drawer must remain closed until explicitly activated
    await expect(drawer).not.toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");

    // 6. Activating hamburger again opens it normally
    await hamburger.click();
    await expect(drawer).toBeVisible();
    await expect(title).toHaveText("Menu");
  });

  test("navigates to Orientation when clicking header identity brand link from another page", async ({
    page,
    isMobile,
  }) => {
    // 1. Start at Project 01
    await page.goto("/#/project-01");
    await expect(page).toHaveURL(/.*#\/project-01/);

    // 2. Click the brand identity link in the header
    if (isMobile) {
      const mobileIdentity = page.locator(".mobile-nav-container .mobile-identity-link");
      await expect(mobileIdentity).toBeVisible();
      await mobileIdentity.click();
    } else {
      const desktopIdentity = page.locator(".desktop-header-container .identity-link");
      await expect(desktopIdentity).toBeVisible();
      await desktopIdentity.click();
    }

    // 3. Verify arrival at Orientation / Home
    await expect(page).toHaveURL(/.*#\/orientation/);
    await expect(page).toHaveTitle(/Portfolio Orientation/);
  });
});
