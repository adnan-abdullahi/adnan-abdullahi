import { test, expect } from "@playwright/test";

test.describe("User Story 2: Engineering Approach Dimension & Traversal (T022)", () => {
  test('traverses from "#/project-01" to "#/approach" and returns to "#/project-01"', async ({
    page,
  }) => {
    // 1. Start at Project 01
    await page.goto("/#/project-01");
    await expect(page).toHaveURL(/.*#\/project-01/);
    await expect(page).toHaveTitle(/Project 01 — Portfolio Experience/);

    // 2. Select Engineering Approach
    const approachLink = page.getByRole("link", {
      name: "Inspect Engineering Approach",
    });
    await expect(approachLink).toBeVisible();
    await approachLink.click();

    // 3. Verify arrival at Engineering Approach
    await expect(page).toHaveURL(/.*#\/approach/);
    await expect(page).toHaveTitle(/Engineering Approach/);

    // Verify Header Identity & Contextual Tag
    const headerIdentity = page.locator(
      ".desktop-header-container .identity-name",
    );
    await expect(headerIdentity).toContainText("Adnan Abdullahi");

    const header = page.locator(".app-header-landmark");
    await expect(header).toContainText("Dimension");

    // Verify View Landmark, Eyebrow & Title
    const eyebrow = page.locator(".approach-eyebrow");
    await expect(eyebrow).toBeVisible();
    await expect(eyebrow).toContainText("PROJECT 01 / DIMENSION");

    const mainHeading = page.locator("#main-heading");
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveText("Engineering Approach");

    // Verify Approved Content
    await expect(page.locator(".approach-intro")).toContainText(
      "The work is not treated as a straight path from idea to implementation.",
    );

    // Verify Exact Governing Philosophy
    await expect(page.locator(".approach-principle-quote")).toHaveText(
      "Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity",
    );

    // Verify Technology Principle
    await expect(page.locator(".approach-technology-principle")).toContainText(
      "Technology is treated as an instrument that assists engineering work. Human understanding, judgment, responsibility, and verification remain central.",
    );

    // 4. Return to Project 01 via View Action Button
    const backBtn = page.getByRole("link", { name: "Back to Project 01" });
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    // 5. Verify return to Project 01
    await expect(page).toHaveURL(/.*#\/project-01/);
    await expect(page).toHaveTitle(/Project 01 — Portfolio Experience/);
    await expect(page.locator(".app-header-landmark")).toContainText(
      "Project Context",
    );
  });

  test('verifies contextual return rail from "#/approach" back to "#/project-01"', async ({
    page,
  }) => {
    // 1. Navigate to Approach
    await page.goto("/#/approach");
    await expect(page).toHaveURL(/.*#\/approach/);

    // 2. Locate Return Rail
    const returnRail = page.locator(".return-rail-link");
    await expect(returnRail).toBeVisible();
    await expect(returnRail).toHaveAttribute("href", "#/project-01");
    await expect(returnRail).toContainText("Return to Project 01");

    // 3. Click Return Rail to execute lateral return
    await returnRail.click();
    await expect(page).toHaveURL(/.*#\/project-01/);
    await expect(page).toHaveTitle(/Project 01 — Portfolio Experience/);
  });

  test('advances from "#/approach" to authorized deeper-inspection path "#/deep-engineering"', async ({
    page,
  }) => {
    // 1. Start at Approach
    await page.goto("/#/approach");
    await expect(page).toHaveURL(/.*#\/approach/);

    // 2. Click Primary Action "Continue to Deep Engineering"
    const deepEngineeringBtn = page.getByRole("link", {
      name: "Continue to Deep Engineering",
    });
    await expect(deepEngineeringBtn).toBeVisible();
    await deepEngineeringBtn.click();

    // 3. Verify arrival at Deep Engineering
    await expect(page).toHaveURL(/.*#\/deep-engineering/);
    await expect(page).toHaveTitle(/Deep Engineering/);

    // Verify Deeper Inspection depth indicator
    const header = page.locator(".app-header-landmark");
    await expect(header).toContainText("Deeper Inspection");
  });

  test('supports direct entry to "#/approach" with preserved context and depth', async ({
    page,
  }) => {
    // Direct entry / deep linking
    await page.goto("/#/approach");

    await expect(page).toHaveURL(/.*#\/approach/);
    await expect(page).toHaveTitle(/Engineering Approach/);
    await expect(page.locator(".approach-title")).toHaveText(
      "Engineering Approach",
    );
    await expect(page.locator(".app-header-landmark")).toContainText(
      "Dimension",
    );
  });
});
