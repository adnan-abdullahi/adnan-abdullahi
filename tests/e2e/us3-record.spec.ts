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

    const contextTag = page.locator(".desktop-header-container .project-tag");
    await expect(contextTag).toHaveText("PROJECT 01");
    await expect(page.locator(".depth-indicator-badge")).toHaveCount(0);

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
    await expect(columns.nth(0)).toContainText(
      "The discrepancy was traced to the inspection path and previous search assumption, after which the design foundations were accepted.",
    );
    await expect(columns.nth(0)).not.toContainText("Stage 04 was accepted");

    // Capture screenshot for visual inspection of Decision 03 wording
    await page.screenshot({
      path: "C:/Users/ADMIN/.gemini/antigravity/brain/1218db9a-ff86-4fe9-b15a-4b4c76f01945/record-decision03-desktop.png",
    });

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
    await expect(
      page.locator(".desktop-header-container .project-tag"),
    ).toHaveText("PROJECT 01");
  });

  test('verifies ReturnRail does not appear and returns to "#/project-01" via approved in-canvas button', async ({
    page,
  }) => {
    // 1. Navigate to Record
    await page.goto("/#/record");
    await expect(page).toHaveURL(/.*#\/record/);

    // 2. Verify ReturnRail is not rendered (Decision 02 Point 2)
    await expect(page.locator(".return-rail-link")).toHaveCount(0);

    // 3. Click approved in-canvas return action
    const backBtn = page.getByRole("link", { name: "Back to Project 01" });
    await expect(backBtn).toBeVisible();
    await backBtn.click();
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

    // Verify Deep Engineering context tag and absence of depth indicator (Decision 02 Point 1)
    await expect(
      page.locator(".desktop-header-container .project-tag"),
    ).toHaveText("PROJECT 01");
    await expect(page.locator(".depth-indicator-badge")).toHaveCount(0);
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
    const contextTag = page.locator(".desktop-header-container .project-tag");
    await expect(contextTag).toHaveText("PROJECT 01");
    await expect(page.locator(".depth-indicator-badge")).toHaveCount(0);
    await expect(page.locator(".return-rail-link")).toHaveCount(0);
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
