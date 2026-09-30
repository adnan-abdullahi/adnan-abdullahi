import { test, expect } from "@playwright/test";

test.describe("User Story 3: Engineering Record Dimension & Decisions (T027)", () => {
  test('traverses from "#/project-01" to "#/record" and returns to "#/project-01"', async ({
    page,
  }) => {
    // 1. Start at Project 01
    await page.goto("/#/project-01");
    await expect(page).toHaveURL(/.*#\/project-01/);
    await expect(page).toHaveTitle(/Project 01 — Portfolio Experience/);

    // 2. Select Engineering Record
    const recordLink = page.getByRole("link", {
      name: "Inspect Engineering Record",
    });
    await expect(recordLink).toBeVisible();
    await recordLink.click();

    // 3. Verify arrival at Engineering Record
    await expect(page).toHaveURL(/.*#\/record/);
    await expect(page).toHaveTitle(/Engineering Record/);

    // Verify Header Identity & Contextual Tag
    const headerIdentity = page.locator(
      ".desktop-header-container .identity-name",
    );
    await expect(headerIdentity).toContainText("Adnan Abdullahi");

    const header = page.locator(".app-header-landmark");
    await expect(header).toContainText("Dimension");

    // Verify View Landmark, Eyebrow & Title
    const eyebrow = page.locator(".record-eyebrow");
    await expect(eyebrow).toBeVisible();
    await expect(eyebrow).toContainText("PROJECT 01 / DIMENSION");

    const mainHeading = page.locator("#main-heading");
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveText("Engineering Record");

    // Verify Approved Intro
    await expect(page.locator(".record-intro")).toContainText(
      "The record preserves how engineering understanding and decisions develop",
    );

    // Verify 3 Chronological Decision Columns (Penpot Columns 1-3)
    const columns = page.locator(".record-column-card");
    await expect(columns).toHaveCount(3);

    // Column 1: DESIGN FOUNDATIONS
    await expect(columns.nth(0)).toContainText("DESIGN FOUNDATIONS");
    await expect(columns.nth(0)).toContainText(
      "An apparent verification failure was investigated before changing the product.",
    );

    // Column 2: PROTOTYPE
    await expect(columns.nth(1)).toContainText("PROTOTYPE");
    await expect(columns.nth(1)).toContainText(
      "During prototype materialization, a redundant interaction and an unresolved navigation destination were discovered and corrected.",
    );

    // Column 3: VALIDATION
    await expect(columns.nth(2)).toContainText("VALIDATION");
    await expect(columns.nth(2)).toContainText(
      "Human evaluation established that the prototype's structure, progressive depth, navigation, and Approach/Record distinction were understandable.",
    );

    // Verify Concluding Reflection Note
    await expect(page.locator(".record-concluding-note")).toContainText(
      "The record does not present the project as complete. It preserves what has been established, what has changed, and what remains uncertain.",
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

  test('verifies contextual return rail from "#/record" back to "#/project-01"', async ({
    page,
  }) => {
    // 1. Navigate to Record
    await page.goto("/#/record");
    await expect(page).toHaveURL(/.*#\/record/);

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

  test('advances from "#/record" to authorized deeper-inspection path "#/deep-engineering"', async ({
    page,
  }) => {
    // 1. Start at Record
    await page.goto("/#/record");
    await expect(page).toHaveURL(/.*#\/record/);

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

  test('supports direct entry to "#/record" with preserved context and depth', async ({
    page,
  }) => {
    await page.goto("/#/record");

    await expect(page).toHaveURL(/.*#\/record/);
    await expect(page).toHaveTitle(/Engineering Record/);
    await expect(page.locator(".record-title")).toHaveText(
      "Engineering Record",
    );
    await expect(page.locator(".app-header-landmark")).toContainText(
      "Dimension",
    );
  });

  test("preserves clear conceptual and visual distinction between Approach and Record (FR-007)", async ({
    page,
  }) => {
    // 1. Inspect Approach view
    await page.goto("/#/approach");
    await expect(page.locator(".approach-title")).toHaveText(
      "Engineering Approach",
    );
    await expect(page.locator(".approach-principle-quote")).toBeVisible();
    // Record columns must not exist in Approach
    await expect(page.locator(".record-columns-grid")).toHaveCount(0);

    // 2. Inspect Record view
    await page.goto("/#/record");
    await expect(page.locator(".record-title")).toHaveText(
      "Engineering Record",
    );
    // Record has 3-column chronological grid
    await expect(page.locator(".record-columns-grid")).toBeVisible();
    await expect(page.locator(".record-column-card")).toHaveCount(3);
    // Approach governing philosophy quote must not exist in Record
    await expect(page.locator(".approach-principle-quote")).toHaveCount(0);
  });
});
