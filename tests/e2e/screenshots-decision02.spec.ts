import { test } from "@playwright/test";

test.describe("Decision 02 Verification Screenshots", () => {
  test("capture desktop screenshots for all 5 views", async ({ page }) => {
    // 1. Orientation
    await page.goto("/#/orientation");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "C:/Users/ADMIN/.gemini/antigravity/brain/1218db9a-ff86-4fe9-b15a-4b4c76f01945/orientation-decision02.png",
      fullPage: false,
    });

    // 2. Project 01
    await page.goto("/#/project-01");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "C:/Users/ADMIN/.gemini/antigravity/brain/1218db9a-ff86-4fe9-b15a-4b4c76f01945/project01-decision02.png",
      fullPage: false,
    });

    // 3. Engineering Approach
    await page.goto("/#/approach");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "C:/Users/ADMIN/.gemini/antigravity/brain/1218db9a-ff86-4fe9-b15a-4b4c76f01945/approach-decision02.png",
      fullPage: false,
    });

    // 4. Engineering Record
    await page.goto("/#/record");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "C:/Users/ADMIN/.gemini/antigravity/brain/1218db9a-ff86-4fe9-b15a-4b4c76f01945/record-decision02.png",
      fullPage: false,
    });

    // 5. Deep Engineering
    await page.goto("/#/deep-engineering");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "C:/Users/ADMIN/.gemini/antigravity/brain/1218db9a-ff86-4fe9-b15a-4b4c76f01945/deep-engineering-decision02.png",
      fullPage: false,
    });
  });
});
