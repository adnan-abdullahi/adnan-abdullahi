import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import router from "../../app/src/router";
import Footer from "../../app/src/components/Footer.vue";

describe("Portfolio Footer Redesign Specification Implementation", () => {
  beforeEach(async () => {
    await router.push("/orientation");
    await router.isReady();
  });

  describe("Semantic Landmark and Identity", () => {
    it("renders a semantic footer landmark with role='contentinfo'", () => {
      const wrapper = mount(Footer, {
        global: { plugins: [router] },
      });

      const footer = wrapper.find("footer");
      expect(footer.exists()).toBe(true);
      expect(footer.attributes("role")).toBe("contentinfo");
      expect(footer.classes()).toContain("app-footer-landmark");
    });

    it("makes personal name a clickable identity link targeting /orientation", () => {
      const wrapper = mount(Footer, {
        global: { plugins: [router] },
      });

      const identityName = wrapper.find(".footer-identity-name");
      expect(identityName.exists()).toBe(true);
      expect(identityName.text()).toBe("Adnan Abdullahi");

      const identityLink = wrapper.find("a.footer-identity-link");
      expect(identityLink.exists()).toBe(true);
      expect(identityLink.attributes("href")).toBe("#/orientation");
      expect(identityLink.attributes("aria-label")).toBe(
        "Adnan Abdullahi — Portfolio Orientation",
      );
    });

    it("displays the approved secondary descriptor 'Computer Scientist • Engineer'", () => {
      const wrapper = mount(Footer, {
        global: { plugins: [router] },
      });

      const descriptor = wrapper.find(".footer-descriptor");
      expect(descriptor.exists()).toBe(true);
      expect(descriptor.text()).toBe("Computer Scientist • Engineer");
    });
  });

  describe("Explore Navigation (Secondary Directory)", () => {
    it("renders Explore section heading and accessible nav landmark", () => {
      const wrapper = mount(Footer, {
        global: { plugins: [router] },
      });

      const exploreHeading = wrapper.find(".footer-explore .footer-heading");
      expect(exploreHeading.exists()).toBe(true);
      expect(exploreHeading.text()).toBe("Explore");

      const nav = wrapper.find("nav.footer-nav");
      expect(nav.exists()).toBe(true);
      expect(nav.attributes("aria-label")).toBe("Explore Navigation");
    });

    it("renders exactly the five approved canonical Explore destinations", () => {
      const wrapper = mount(Footer, {
        global: { plugins: [router] },
      });

      const navLinks = wrapper.findAll(".footer-explore a.footer-link");
      expect(navLinks).toHaveLength(5);

      const destinations = navLinks.map((link) => ({
        label: link.text().trim(),
        href: link.attributes("href"),
      }));

      expect(destinations).toEqual([
        { label: "Home", href: "#/orientation" },
        { label: "Engineering Record", href: "#/record" },
        { label: "Approach", href: "#/approach" },
        { label: "About", href: "#/about" },
        { label: "Contact", href: "#/contact" },
      ]);
    });

    it("does not render active-page underlines, active classes, or aria-current in the footer", async () => {
      const routesToTest = [
        "/orientation",
        "/record",
        "/approach",
        "/about",
        "/contact",
      ];

      for (const routePath of routesToTest) {
        await router.push(routePath);
        await router.isReady();

        const wrapper = mount(Footer, {
          global: { plugins: [router] },
        });

        const exploreLinks = wrapper.findAll(".footer-explore a.footer-link");
        expect(exploreLinks).toHaveLength(5);

        for (const link of exploreLinks) {
          // No active class
          expect(link.classes()).not.toContain("footer-nav-link--active");
          expect(link.classes()).not.toContain("nav-link--active");

          // No aria-current attribute
          expect(link.attributes("aria-current")).toBeUndefined();
        }
      }
    });
  });

  describe("Connect Section (Confirmed Public Profiles)", () => {
    it("renders Connect section heading and exactly the two approved profiles", () => {
      const wrapper = mount(Footer, {
        global: { plugins: [router] },
      });

      const connectHeading = wrapper.find(".footer-connect .footer-heading");
      expect(connectHeading.exists()).toBe(true);
      expect(connectHeading.text()).toBe("Connect");

      const connectLinks = wrapper.findAll(".footer-connect a.footer-link--external");
      expect(connectLinks).toHaveLength(2);

      const profiles = connectLinks.map((link) => ({
        label: link.find("span").text().trim(),
        href: link.attributes("href"),
        target: link.attributes("target"),
        rel: link.attributes("rel"),
        ariaLabel: link.attributes("aria-label"),
      }));

      expect(profiles).toEqual([
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/adnan-abdullahi-a85322172/",
          target: "_blank",
          rel: "noopener noreferrer",
          ariaLabel: "Adnan Abdullahi on LinkedIn (opens in new tab)",
        },
        {
          label: "GitHub",
          href: "https://github.com/adnan-abdullahi/",
          target: "_blank",
          rel: "noopener noreferrer",
          ariaLabel: "Adnan Abdullahi on GitHub (opens in new tab)",
        },
      ]);
    });

    it("displays subtle external link indicators on Connect links", () => {
      const wrapper = mount(Footer, {
        global: { plugins: [router] },
      });

      const icons = wrapper.findAll(".footer-connect .external-icon");
      expect(icons).toHaveLength(2);
      for (const icon of icons) {
        expect(icon.text()).toBe("↗");
        expect(icon.attributes("aria-hidden")).toBe("true");
      }
    });
  });

  describe("Link Totals and Absence of Prohibited Content", () => {
    it("contains exactly 8 total links and no prohibited routes or social networks", () => {
      const wrapper = mount(Footer, {
        global: { plugins: [router] },
      });

      const allLinks = wrapper.findAll("a");
      expect(allLinks).toHaveLength(8); // 1 identity + 5 explore + 2 connect

      const allHrefs = allLinks.map((l) => l.attributes("href") || "");

      // Verify prohibited internal routes are not present
      expect(allHrefs).not.toContain("#/project-01");
      expect(allHrefs).not.toContain("#/deep-engineering");
      expect(allHrefs).not.toContain("#main-content");

      // Verify no other social platforms are present
      for (const href of allHrefs) {
        expect(href).not.toContain("youtube.com");
        expect(href).not.toContain("facebook.com");
        expect(href).not.toContain("twitter.com");
        expect(href).not.toContain("x.com");
        expect(href).not.toContain("instagram.com");
      }
    });
  });

  describe("Copyright and Colophon", () => {
    it("displays exactly the approved copyright text '© 2026 Adnan Abdullahi'", () => {
      const wrapper = mount(Footer, {
        global: { plugins: [router] },
      });

      const copyright = wrapper.find(".footer-copyright");
      expect(copyright.exists()).toBe(true);
      expect(copyright.text()).toBe("© 2026 Adnan Abdullahi");
    });
  });
});
