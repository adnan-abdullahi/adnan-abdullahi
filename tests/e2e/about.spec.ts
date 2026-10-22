import { test, expect } from "@playwright/test";

test.describe("About Page & Navigation Traversal", () => {
  test('navigates from "#/orientation" to "#/about" via header navigation', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Desktop header navigation is visible on viewports >= 768px");

    // 1. Start at Orientation
    await page.goto("/#/orientation");
    await expect(page).toHaveURL(/.*#\/orientation/);

    // 2. Select About in Header Navigation
    const aboutNav = page.locator(".desktop-header-container").getByRole("link", {
      name: "About",
    });
    await expect(aboutNav).toBeVisible();
    await aboutNav.click();

    // 3. Verify arrival at About page
    await expect(page).toHaveURL(/.*#\/about/);
    await expect(page).toHaveTitle(/About/);

    // Verify Header Identity & Open Header (no project badge on About)
    const headerIdentity = page.locator(".desktop-header-container .identity-name");
    await expect(headerIdentity).toContainText("Adnan Abdullahi");
    await expect(page.locator(".desktop-header-container .project-tag")).toHaveCount(0);

    // Verify Active nav state on About
    await expect(aboutNav).toHaveClass(/nav-link--active/);

    // Verify Main Page Title
    const mainHeading = page.locator("#main-heading");
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveText("About");
  });

  test("verifies full 5-section content fidelity on About page", async ({
    page,
  }) => {
    await page.goto("/#/about");
    await expect(page).toHaveURL(/.*#\/about/);

    // Section 1: About Me Eyebrow & Identity
    const aboutMeHeading = page.locator("#about-me-heading");
    await expect(aboutMeHeading).toHaveText("About Me");
    await expect(aboutMeHeading).toHaveClass(/about-eyebrow/);
    await expect(page.locator(".about-view .identity-name")).toHaveText("Adnan Abdullahi");
    await expect(page.locator(".about-view .identity-role")).toHaveText("Computer Scientist • Engineer");

    // Verify main page title styling (primary text color)
    const mainHeadingColor = await page.locator("#main-heading").evaluate(
      (el) => window.getComputedStyle(el).color,
    );
    expect(mainHeadingColor).toBe("rgb(24, 33, 43)");

    // Section 2: How I Work (Blue Accent Heading)
    const howIWorkHeading = page.locator("#how-i-work-heading");
    await expect(howIWorkHeading).toHaveText("How I Work");
    const howIWorkColor = await howIWorkHeading.evaluate(
      (el) => window.getComputedStyle(el).color,
    );
    expect(howIWorkColor).toBe("rgb(36, 91, 143)");
    await expect(page.locator(".about-view")).toContainText(
      "I build in order to turn understanding into something tangible.",
    );
    await expect(page.locator(".about-view")).toContainText(
      "I verify what has actually been established rather than relying only on the appearance of success.",
    );
    await expect(page.locator(".about-view")).toContainText(
      "Modern tools, including AI-assisted tools, can support investigation",
    );
    await expect(page.locator(".closing-principle")).toHaveText(
      "The technology supports the work. Human understanding and engineering judgment remain central.",
    );

    // Section 3: What I Work On (Blue Accent Heading)
    const whatIWorkOnHeading = page.locator("#what-i-work-on-heading");
    await expect(whatIWorkOnHeading).toHaveText("What I Work On");
    const whatIWorkOnColor = await whatIWorkOnHeading.evaluate(
      (el) => window.getComputedStyle(el).color,
    );
    expect(whatIWorkOnColor).toBe("rgb(36, 91, 143)");
    await expect(page.locator(".about-view")).toContainText(
      "This portfolio exists to make that development inspectable.",
    );

    // Section 4: Where I'm Going (Blue Accent Heading)
    const whereImGoingHeading = page.locator("#where-im-going-heading");
    await expect(whereImGoingHeading).toHaveText("Where I'm Going");
    const whereImGoingColor = await whereImGoingHeading.evaluate(
      (el) => window.getComputedStyle(el).color,
    );
    expect(whereImGoingColor).toBe("rgb(36, 91, 143)");
    await expect(page.locator(".about-view")).toContainText(
      "My engineering practice is still developing.",
    );
    await expect(page.locator(".about-view")).toContainText(
      "I do not see learning as something that ends when a particular skill, project, or stage is completed.",
    );

    // Section 5: Let's Connect (Blue Accent Heading) & CTA
    const letsConnectHeading = page.locator("#lets-connect-heading");
    await expect(letsConnectHeading).toHaveText("Let's Connect");
    const letsConnectColor = await letsConnectHeading.evaluate(
      (el) => window.getComputedStyle(el).color,
    );
    expect(letsConnectColor).toBe("rgb(36, 91, 143)");
    await expect(page.locator(".about-view")).toContainText(
      "Perhaps the work has given you an idea, raised a problem worth exploring",
    );
    await expect(page.locator(".about-view")).toContainText(
      "Take it one step further. Bring the idea, problem, or possibility into a conversation",
    );

    // Verify CTA button label & destination
    const ctaBtn = page.getByRole("link", { name: "Bring an Idea" });
    await expect(ctaBtn).toBeVisible();
    await expect(ctaBtn).toHaveAttribute("href", "#/contact");
  });

  test("renders responsively without horizontal overflow across desktop, tablet, and mobile", async ({
    page,
  }) => {
    const viewports = [
      { name: "desktop", width: 1440, height: 900 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "mobile", width: 375, height: 667 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/#/about");

      // Main heading and CTA must be present
      await expect(page.locator("#main-heading")).toBeVisible();
      const ctaBtn = page.getByRole("link", { name: "Bring an Idea" });
      await expect(ctaBtn).toBeVisible();

      // Check for horizontal overflow
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

      // Check section responsive spacing (desktop: 64px, tablet: 48px, mobile: 40px)
      const sectionMargin = await page.locator(".about-section").first().evaluate(
        (el) => window.getComputedStyle(el).marginBottom,
      );
      if (vp.name === "desktop") {
        expect(sectionMargin).toBe("64px");
      } else if (vp.name === "tablet") {
        expect(sectionMargin).toBe("48px");
      } else if (vp.name === "mobile") {
        expect(sectionMargin).toBe("40px");
      }

      // Capture screenshot for visual inspection
      await page.screenshot({
        path: `C:/Users/ADMIN/.gemini/antigravity/brain/bb5effdd-fbb7-4d53-af39-dfdad2612b4d/about-${vp.name}.png`,
        fullPage: true,
      });
    }
  });
});
