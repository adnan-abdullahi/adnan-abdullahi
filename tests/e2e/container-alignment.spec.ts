import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile-375", width: 375, height: 667, expectedPad: 16 },
  { name: "tablet-768", width: 768, height: 1024, expectedPad: 24 },
  { name: "tablet-1024", width: 1024, height: 768, expectedPad: 24 },
  { name: "desktop-1440", width: 1440, height: 840, expectedPad: 80 },
  { name: "desktop-1920", width: 1920, height: 1080, expectedPad: 80 }, // Centered container: (1920-1440)/2 + 80 = 320
];

const routes = [
  { path: "/#/orientation", name: "Orientation" },
  { path: "/#/project-01", name: "Project 01" },
  { path: "/#/approach", name: "Approach" },
  { path: "/#/record", name: "Record" },
  { path: "/#/deep-engineering", name: "Deep Engineering" },
  { path: "/#/about", name: "About" },
  { path: "/#/contact", name: "Contact" },
];

test.describe("Correction 2: Shared Container Alignment & Spacing System", () => {
  for (const vp of viewports) {
    test.describe(`Viewport: ${vp.name} (${vp.width}x${vp.height})`, () => {
      for (const r of routes) {
        test(`aligns header identity and page heading within 1px on ${r.name}`, async ({
          page,
        }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(r.path);

          // Get header identity element (mobile vs desktop header)
          const isMobile = vp.width < 768;
          const headerIdentity = isMobile
            ? page.locator(".mobile-identity-name")
            : page.locator(".desktop-header-container .identity-name");

          await expect(headerIdentity).toBeVisible();
          const headerBox = await headerIdentity.boundingBox();
          expect(headerBox).not.toBeNull();

          // Get page heading
          const heading = page.locator("#main-heading").first();
          await expect(heading).toBeVisible();
          const headingBox = await heading.boundingBox();
          expect(headingBox).not.toBeNull();

          // Assert left alignment within 1px
          const delta = Math.abs((headingBox?.x ?? 0) - (headerBox?.x ?? 0));
          expect(delta).toBeLessThanOrEqual(1);

          // Get footer identity element and assert left alignment within 1px
          const footerIdentity = page.locator(".footer-identity-name");
          await expect(footerIdentity).toBeVisible();
          const footerBox = await footerIdentity.boundingBox();
          expect(footerBox).not.toBeNull();

          const footerDelta = Math.abs((footerBox?.x ?? 0) - (headerBox?.x ?? 0));
          expect(footerDelta).toBeLessThanOrEqual(1);

          // Verify footer copyright is visible
          const footerCopyright = page.locator(".footer-copyright");
          await expect(footerCopyright).toBeVisible();
          await expect(footerCopyright).toHaveText("© 2026 Adnan Abdullahi");

          // Verify Explore and Connect areas are rendered
          const exploreSection = page.locator(".footer-explore");
          await expect(exploreSection).toBeVisible();
          const connectSection = page.locator(".footer-connect");
          await expect(connectSection).toBeVisible();

          // Check horizontal overflow
          const scrollWidth = await page.evaluate(
            () => document.documentElement.scrollWidth,
          );
          const clientWidth = await page.evaluate(
            () => document.documentElement.clientWidth,
          );
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
        });
      }
    });
  }
});

