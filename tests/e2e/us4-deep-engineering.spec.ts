import { test, expect } from "@playwright/test";

test.describe("User Story 4: Deep Engineering & Contextual Return (T031)", () => {
  test('traverses from "#/approach" to "#/deep-engineering" and contextually returns to "#/project-01"', async ({
    page,
  }) => {
    // 1. Start at Engineering Approach
    await page.goto("/#/approach");
    await expect(page).toHaveURL(/.*#\/approach/);

    // 2. Select Continue to Deep Engineering
    const deepEngineeringBtn = page.getByRole("link", {
      name: "Continue to Deep Engineering",
    });
    await expect(deepEngineeringBtn).toBeVisible();
    await deepEngineeringBtn.click();

    // 3. Verify arrival at Deep Engineering
    await expect(page).toHaveURL(/.*#\/deep-engineering/);
    await expect(page).toHaveTitle(/Deep Engineering/);

    // Verify Header Identity & Deeper Inspection depth indicator
    const headerIdentity = page.locator(
      ".desktop-header-container .identity-name",
    );
    await expect(headerIdentity).toContainText("Adnan Abdullahi");

    const contextTag = page.locator(".desktop-header-container .project-tag");
    await expect(contextTag).toHaveText("PROJECT 01");
    await expect(page.locator(".depth-indicator-badge")).toHaveCount(0);

    // Verify View Landmark, Eyebrow & Title
    const eyebrow = page.locator(".deep-eyebrow");
    await expect(eyebrow).toBeVisible();
    await expect(eyebrow).toContainText("PROJECT 01 / DEEPER INSPECTION");

    const mainHeading = page.locator("#main-heading");
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveText("Deep Engineering");

    // Verify Intro narrative
    await expect(page.locator(".deep-intro")).toContainText(
      "Deeper inspection moves from the resulting interface into the evidence behind engineering decisions.",
    );

    // Verify Subtitle and Narrative
    await expect(page.locator(".case-study-subtitle")).toContainText(
      "Design Foundations",
    );
    const narrativeParagraphs = page.locator(".narrative-paragraph");
    await expect(narrativeParagraphs).toHaveCount(3);
    await expect(narrativeParagraphs.nth(0)).toContainText(
      "An initial inspection appeared to indicate that the approved semantic color system had not been correctly implemented.",
    );

    // Verify Flow Sequence Block (Penpot Board 05)
    const flowSteps = page.locator(".flow-step-name");
    await expect(flowSteps).toHaveCount(6);
    await expect(flowSteps.nth(0)).toHaveText("Implementation");
    await expect(flowSteps.nth(1)).toHaveText("Verification");
    await expect(flowSteps.nth(2)).toHaveText("Apparent Discrepancy");
    await expect(flowSteps.nth(3)).toHaveText("Investigation");
    await expect(flowSteps.nth(4)).toHaveText("Reconciliation");
    await expect(flowSteps.nth(5)).toHaveText("Acceptance");

    // Verify 9-Part Evidence Chain (EvidenceCard) is REMOVED per Penpot Board 05
    await expect(page.locator(".evidence-step")).toHaveCount(0);
    await expect(page.locator(".evidence-chain-wrapper")).toHaveCount(0);
    await expect(
      page.locator('[data-uncertainty-boundary="true"]'),
    ).toHaveCount(0);

    // Verify 3-Column Spatial Composition (Penpot Board 05)
    await expect(page.locator(".narrative-column")).toBeVisible();
    await expect(page.locator(".flow-column")).toBeVisible();
    await expect(page.locator(".boundary-column")).toBeVisible();

    // Verify Open Scope & Validation Gap Text (Penpot Board 05)
    const scopeText = page.locator('[data-boundary="scope"]');
    await expect(scopeText).toContainText(
      "This project does not yet claim production implementation",
    );

    const validationGapText = page.locator('[data-boundary="validation-gap"]');
    await expect(validationGapText).toContainText(
      "Current validation has identified a different gap",
    );

    // Verify No Forward Action (Deep Engineering is the deepest level)
    await expect(page.getByRole("link", { name: /Continue to/ })).toHaveCount(
      0,
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

  test('verifies ReturnRail does not appear on "#/deep-engineering" and returns via approved in-canvas action', async ({
    page,
  }) => {
    // 1. Start at Engineering Record
    await page.goto("/#/record");
    await expect(page).toHaveURL(/.*#\/record/);

    // 2. Select Continue to Deep Engineering
    const deepEngineeringBtn = page.getByRole("link", {
      name: "Continue to Deep Engineering",
    });
    await expect(deepEngineeringBtn).toBeVisible();
    await deepEngineeringBtn.click();

    // 3. Verify arrival at Deep Engineering
    await expect(page).toHaveURL(/.*#\/deep-engineering/);
    await expect(page).toHaveTitle(/Deep Engineering/);
    await expect(page.locator(".depth-indicator-badge")).toHaveCount(0);

    // 4. Verify ReturnRail is not rendered (Decision 02 Point 2)
    await expect(page.locator(".return-rail-link")).toHaveCount(0);

    // 5. Click approved in-canvas return action to execute return to Project 01
    const backBtn = page.getByRole("link", { name: "Back to Project 01" });
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL(/.*#\/project-01/);
    await expect(page).toHaveTitle(/Project 01 — Portfolio Experience/);
    await expect(
      page.locator(".desktop-header-container .project-tag"),
    ).toHaveText("PROJECT 01");
  });

  test('supports direct entry to "#/deep-engineering" with preserved context', async ({
    page,
  }) => {
    await page.goto("/#/deep-engineering");

    await expect(page).toHaveURL(/.*#\/deep-engineering/);
    await expect(page).toHaveTitle(/Deep Engineering — Design Foundations/);
    await expect(page.locator(".deep-title")).toHaveText("Deep Engineering");
    await expect(
      page.locator(".desktop-header-container .project-tag"),
    ).toHaveText("PROJECT 01");
    await expect(page.locator(".depth-indicator-badge")).toHaveCount(0);

    // Verify ReturnRail is not rendered (Decision 02 Point 2)
    await expect(page.locator(".return-rail-link")).toHaveCount(0);
  });

  test("renders responsively without horizontal overflow across viewports", async ({
    page,
  }) => {
    const viewports = [
      { name: "desktop", width: 1440, height: 840 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "mobile", width: 375, height: 667 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/#/deep-engineering");

      // Main heading and return action must be visible
      await expect(page.locator("#main-heading")).toBeVisible();
      const backBtn = page.getByRole("link", { name: "Back to Project 01" });
      await expect(backBtn).toBeVisible();

      // Check for horizontal scrollbar / overflow
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

      // Capture screenshot for visual inspection
      await page.screenshot({
        path: `C:/Users/ADMIN/.gemini/antigravity/brain/1218db9a-ff86-4fe9-b15a-4b4c76f01945/deep-engineering-${vp.name}.png`,
        fullPage: true,
      });
    }
  });
});
