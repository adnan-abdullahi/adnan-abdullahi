import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Stage 08 Accessibility Foundation (T002, Category V5)", () => {
  test("verifies axe-core can audit document and passes critical accessibility checks", async ({
    page,
  }) => {
    await page.goto("/");
    // Direction C Light foundation provides verified contrast:
    // - #FFFFFF on #245B8F: 7.02:1 (exceeds WCAG AA 4.5:1 and AAA 7.0:1)
    // - #18212B on #FFFFFF: 14.6:1 (AAA)
    // - #52606D on #FFFFFF: 6.0:1 (AA)
    // - #245B8F on #E3EEF7: 4.8:1 (AA)
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("verifies axe-core audit passes on #/approach (Engineering Approach dimension)", async ({
    page,
  }) => {
    await page.goto("/#/approach");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("verifies axe-core audit passes on #/record (Engineering Record dimension)", async ({
    page,
  }) => {
    await page.goto("/#/record");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("verifies axe-core audit passes on #/deep-engineering (Deep Engineering level)", async ({
    page,
  }) => {
    await page.goto("/#/deep-engineering");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("verifies axe-core audit passes on #/about (About narrative page)", async ({
    page,
  }) => {
    await page.goto("/#/about");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
