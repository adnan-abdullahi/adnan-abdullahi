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

    await expect(page.locator(".project-tag")).toHaveCount(0);
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
    await expect(page.locator(".project-tag")).toHaveCount(0);
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
    await expect(page.locator(".project-tag")).toHaveCount(0);
  });

  test('supports direct entry to "#/deep-engineering" with preserved context', async ({
    page,
  }) => {
    await page.goto("/#/deep-engineering");

    await expect(page).toHaveURL(/.*#\/deep-engineering/);
    await expect(page).toHaveTitle(/Deep Engineering — Design Foundations/);
    await expect(page.locator(".deep-title")).toHaveText("Deep Engineering");
    await expect(page.locator(".project-tag")).toHaveCount(0);
    await expect(page.locator(".depth-indicator-badge")).toHaveCount(0);

    // Verify ReturnRail is not rendered (Decision 02 Point 2)
    await expect(page.locator(".return-rail-link")).toHaveCount(0);
  });

  test("renders responsively without horizontal overflow across viewports", async ({
    page,
  }) => {
    const testViewports = [
      { name: "mobile-375", width: 375, height: 667, isStacked: true },
      { name: "mobile-390", width: 390, height: 844, isStacked: true },
      { name: "mobile-430", width: 430, height: 932, isStacked: true },
      { name: "tablet-768", width: 768, height: 1024, isStacked: true },
      { name: "tablet-1024", width: 1024, height: 768, isStacked: true },
      { name: "desktop-1025", width: 1025, height: 768, isStacked: false },
      { name: "desktop-1100", width: 1100, height: 800, isStacked: false },
      { name: "desktop-1200", width: 1200, height: 800, isStacked: false },
      { name: "desktop-1280", width: 1280, height: 800, isStacked: false },
      { name: "desktop-1366", width: 1366, height: 768, isStacked: false },
      { name: "desktop-1439", width: 1439, height: 900, isStacked: false },
      { name: "desktop-1440", width: 1440, height: 840, isStacked: false },
      { name: "desktop-1920", width: 1920, height: 1080, isStacked: false },
    ];

    for (const vp of testViewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/#/deep-engineering");
      await page.waitForLoadState("networkidle");

      // 1. Heading and return action must remain visible and accessible
      await expect(page.locator("#main-heading")).toBeVisible();
      const backBtn = page.getByRole("link", { name: "Back to Project 01" });
      await expect(backBtn).toBeVisible();

      // 2. Zero horizontal overflow check: scrollWidth must not exceed clientWidth
      const metrics = await page.evaluate(() => {
        const docEl = document.documentElement;
        const container = document.querySelector(".main-viewport-container");
        const deepCols = document.querySelector(".deep-columns");
        const narrative = document.querySelector(".narrative-column");
        const flow = document.querySelector(".flow-column");
        const boundary = document.querySelector(".boundary-column");

        const getBox = (el: Element | null) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            right: r.right,
          };
        };

        const getStyle = (el: Element | null) =>
          el ? window.getComputedStyle(el) : null;

        return {
          clientWidth: docEl.clientWidth,
          scrollWidth: docEl.scrollWidth,
          containerBox: getBox(container),
          containerPaddingRight: getStyle(container)?.paddingRight,
          deepColsFlexDir: getStyle(deepCols)?.flexDirection,
          narrativeBox: getBox(narrative),
          flowBox: getBox(flow),
          flowMarginLeft: getStyle(flow)?.marginLeft,
          boundaryBox: getBox(boundary),
          boundaryMarginLeft: getStyle(boundary)?.marginLeft,
        };
      });

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);

      // 3. Verify intended responsive layout mode (stacked below 1025px, 3-column row >= 1025px)
      if (vp.isStacked) {
        expect(metrics.deepColsFlexDir).toBe("column");
      } else {
        expect(metrics.deepColsFlexDir).toBe("row");

        // 4. Boundary column must not extend beyond the available container content boundary
        const padRight = parseFloat(metrics.containerPaddingRight || "80");
        const containerContentRight =
          (metrics.containerBox?.x ?? 0) +
          (metrics.containerBox?.width ?? vp.width) -
          padRight;
        expect(metrics.boundaryBox?.right).toBeLessThanOrEqual(
          containerContentRight + 1,
        );

        // Middle flow sequence must remain fixed at 165px without deformation
        expect(Math.round(metrics.flowBox?.width ?? 0)).toBe(165);
      }

      // 5. Baseline fidelity at 1440px and above: original Penpot dimensions and margins preserved
      if (vp.width >= 1440) {
        expect(Math.round(metrics.narrativeBox?.width ?? 0)).toBe(640);
        expect(Math.round(metrics.flowBox?.width ?? 0)).toBe(165);
        expect(Math.round(parseFloat(metrics.flowMarginLeft || "0"))).toBe(40);
        expect(Math.round(metrics.boundaryBox?.width ?? 0)).toBe(360);
        expect(Math.round(parseFloat(metrics.boundaryMarginLeft || "0"))).toBe(
          75,
        );
      }

      // 6. Centering check at 1920px wide desktop
      if (vp.width === 1920) {
        // Container is max 1440px centered: (1920 - 1440) / 2 = 240px offset
        expect(Math.round(metrics.containerBox?.x ?? 0)).toBe(240);
        // Narrative content starts at 240 + 80 = 320px
        expect(Math.round(metrics.narrativeBox?.x ?? 0)).toBe(320);
      }

      // 7. Verify all flow sequence steps are visible and unclipped
      const flowStepNames = page.locator(".flow-step-name");
      await expect(flowStepNames).toHaveCount(6);
      for (let i = 0; i < 6; i++) {
        await expect(flowStepNames.nth(i)).toBeVisible();
      }
    }
  });
});
