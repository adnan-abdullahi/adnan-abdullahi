import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import router from "../../app/src/router";
import Header from "../../app/src/components/Header.vue";
import MobileNav from "../../app/src/components/MobileNav.vue";
import { orientationContent } from "../../app/src/content/orientation";

describe("Authorized Navigation Specification Implementation", () => {
  beforeEach(async () => {
    await router.push("/orientation");
    await router.isReady();
  });

  describe("Requirement A & B: Desktop Navigation", () => {
    it("renders all 5 canonical destinations with correct routes", async () => {
      const wrapper = mount(Header, {
        global: { plugins: [router] },
      });

      const navLinks = wrapper.findAll(".nav-list a.nav-link");
      expect(navLinks).toHaveLength(5);

      const destinations = navLinks.map((link) => ({
        label: link.text(),
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

    it("makes personal name/logo a clickable identity link targeting /orientation", () => {
      const wrapper = mount(Header, {
        global: { plugins: [router] },
      });

      const identityName = wrapper.find(".identity-name");
      expect(identityName.exists()).toBe(true);
      expect(identityName.text()).toBe("Adnan Abdullahi");

      // Verify it is inside .identity-link anchor targeting /orientation
      const identityLink = wrapper.find("a.identity-link");
      expect(identityLink.exists()).toBe(true);
      expect(identityLink.attributes("href")).toBe("#/orientation");
      expect(identityLink.attributes("aria-label")).toBe("Adnan Abdullahi — Portfolio Orientation");
    });

    it("indicates active destination visually and programmatically with aria-current='page'", async () => {
      // 1. Home active on /orientation
      await router.push("/orientation");
      await router.isReady();
      let wrapper = mount(Header, { global: { plugins: [router] } });

      const homeLink = wrapper.find('.nav-list a[href="#/orientation"]');
      expect(homeLink.classes()).toContain("nav-link--active");
      expect(homeLink.attributes("aria-current")).toBe("page");

      const recordLinkInactive = wrapper.find('a[href="#/record"]');
      expect(recordLinkInactive.classes()).not.toContain("nav-link--active");
      expect(recordLinkInactive.attributes("aria-current")).toBeUndefined();

      // 2. Engineering Record active on /record
      await router.push("/record");
      await router.isReady();
      wrapper = mount(Header, { global: { plugins: [router] } });

      const recordLinkActive = wrapper.find('a[href="#/record"]');
      expect(recordLinkActive.classes()).toContain("nav-link--active");
      expect(recordLinkActive.attributes("aria-current")).toBe("page");

      // 3. Approach active on /approach
      await router.push("/approach");
      await router.isReady();
      wrapper = mount(Header, { global: { plugins: [router] } });

      const approachLinkActive = wrapper.find('a[href="#/approach"]');
      expect(approachLinkActive.classes()).toContain("nav-link--active");
      expect(approachLinkActive.attributes("aria-current")).toBe("page");

      // 4. About active on /about
      await router.push("/about");
      await router.isReady();
      wrapper = mount(Header, { global: { plugins: [router] } });

      const aboutLinkActive = wrapper.find('a[href="#/about"]');
      expect(aboutLinkActive.classes()).toContain("nav-link--active");
      expect(aboutLinkActive.attributes("aria-current")).toBe("page");
    });
  });

  describe("Requirement C, D & E: Mobile Navigation & Side Drawer", () => {
    it("renders hamburger menu button and removes contextual Return controls from header", () => {
      const wrapper = mount(MobileNav, {
        global: { plugins: [router] },
      });

      // Hamburger button exists with accessibility semantics
      const hamburger = wrapper.find(".mobile-hamburger-btn");
      expect(hamburger.exists()).toBe(true);
      expect(hamburger.attributes("aria-label")).toBe("Open navigation menu");
      expect(hamburger.attributes("aria-expanded")).toBe("false");
      expect(hamburger.attributes("aria-controls")).toBe("mobile-nav-drawer");

      // Mobile identity is a clickable link to /orientation
      const mobileIdentityLink = wrapper.find("a.mobile-identity-link");
      expect(mobileIdentityLink.exists()).toBe(true);
      expect(mobileIdentityLink.attributes("href")).toBe("#/orientation");
      expect(mobileIdentityLink.find(".mobile-identity-name").text()).toBe("Adnan Abdullahi");

      // No contextual Return button
      expect(wrapper.find(".mobile-return-btn").exists()).toBe(false);

      // Drawer is initially closed
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(false);
    });

    it("opens side drawer exposing all 5 canonical destinations upon activating hamburger", async () => {
      const wrapper = mount(MobileNav, {
        global: { plugins: [router] },
      });

      const hamburger = wrapper.find(".mobile-hamburger-btn");
      await hamburger.trigger("click");

      expect(hamburger.attributes("aria-expanded")).toBe("true");

      const drawer = wrapper.find("#mobile-nav-drawer");
      expect(drawer.exists()).toBe(true);
      expect(drawer.attributes("role")).toBe("dialog");
      expect(drawer.attributes("aria-modal")).toBe("true");

      const links = drawer.findAll("a.mobile-drawer-link");
      expect(links).toHaveLength(5);

      const items = links.map((l) => ({
        label: l.find(".link-label").text(),
        href: l.attributes("href"),
      }));

      expect(items).toEqual([
        { label: "Home", href: "#/orientation" },
        { label: "Engineering Record", href: "#/record" },
        { label: "Approach", href: "#/approach" },
        { label: "About", href: "#/about" },
        { label: "Contact", href: "#/contact" },
      ]);
    });

    it("closes drawer when selecting a destination (Requirement D.1)", async () => {
      const wrapper = mount(MobileNav, {
        global: { plugins: [router] },
      });

      // Open drawer
      await wrapper.find(".mobile-hamburger-btn").trigger("click");
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(true);

      // Click a link
      const recordLink = wrapper.find('a[href="#/record"]');
      await recordLink.trigger("click");

      // Drawer should close
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(false);
      expect(wrapper.find(".mobile-hamburger-btn").attributes("aria-expanded")).toBe("false");
    });

    it("closes drawer when clicking outside/backdrop (Requirement D.2)", async () => {
      const wrapper = mount(MobileNav, {
        global: { plugins: [router] },
      });

      // Open drawer
      await wrapper.find(".mobile-hamburger-btn").trigger("click");
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(true);

      // Click backdrop
      const backdrop = wrapper.find(".mobile-drawer-backdrop");
      expect(backdrop.exists()).toBe(true);
      await backdrop.trigger("click");

      // Drawer should close
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(false);
    });

    it("closes drawer when pressing Escape key (Requirement D.3)", async () => {
      const wrapper = mount(MobileNav, {
        global: { plugins: [router] },
        attachTo: document.body,
      });

      // Open drawer
      await wrapper.find(".mobile-hamburger-btn").trigger("click");
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(true);

      // Press Escape
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await wrapper.vm.$nextTick();

      // Drawer should close
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(false);

      wrapper.unmount();
    });

    it("provides visible, accessible close control (Requirement D.4 & E)", async () => {
      const wrapper = mount(MobileNav, {
        global: { plugins: [router] },
      });

      // Open drawer
      await wrapper.find(".mobile-hamburger-btn").trigger("click");

      const closeBtn = wrapper.find(".mobile-drawer-close-btn");
      expect(closeBtn.exists()).toBe(true);
      expect(closeBtn.attributes("aria-label")).toBe("Close navigation menu");

      // Activating close button closes drawer
      await closeBtn.trigger("click");
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(false);
    });

    it("displays visible heading 'Menu' in drawer header while preserving accessible dialog semantics", async () => {
      const wrapper = mount(MobileNav, {
        global: { plugins: [router] },
      });

      await wrapper.find(".mobile-hamburger-btn").trigger("click");

      const drawer = wrapper.find("#mobile-nav-drawer");
      expect(drawer.exists()).toBe(true);
      expect(drawer.attributes("role")).toBe("dialog");
      expect(drawer.attributes("aria-modal")).toBe("true");
      expect(drawer.attributes("aria-label")).toBe("Navigation Menu");

      const title = drawer.find(".mobile-drawer-title");
      expect(title.exists()).toBe(true);
      expect(title.text()).toBe("Menu");
    });

    it("closes drawer when viewport resizes to desktop width and keeps it closed when returning to mobile", async () => {
      window.innerWidth = 375;
      const wrapper = mount(MobileNav, {
        global: { plugins: [router] },
        attachTo: document.body,
      });

      // 1. Open drawer on mobile
      const hamburger = wrapper.find(".mobile-hamburger-btn");
      await hamburger.trigger("click");
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(true);
      expect(hamburger.attributes("aria-expanded")).toBe("true");

      // 2. Viewport crosses into desktop breakpoint (>= 768px)
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
      await wrapper.vm.$nextTick();

      // Drawer should be closed and open state cleared
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(false);
      expect(hamburger.attributes("aria-expanded")).toBe("false");

      // 3. Viewport returns to mobile width (< 768px)
      window.innerWidth = 375;
      window.dispatchEvent(new Event("resize"));
      await wrapper.vm.$nextTick();

      // Drawer must remain closed
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(false);
      expect(hamburger.attributes("aria-expanded")).toBe("false");

      // 4. Activating hamburger again opens it normally
      await hamburger.trigger("click");
      expect(wrapper.find("#mobile-nav-drawer").exists()).toBe(true);
      expect(hamburger.attributes("aria-expanded")).toBe("true");

      wrapper.unmount();
    });

    it("clearly indicates active destination in mobile drawer (Requirement C.7 & E)", async () => {
      await router.push("/about");
      await router.isReady();

      const wrapper = mount(MobileNav, {
        global: { plugins: [router] },
      });

      await wrapper.find(".mobile-hamburger-btn").trigger("click");

      const drawer = wrapper.find("#mobile-nav-drawer");
      const aboutLink = drawer.find('a[href="#/about"]');
      expect(aboutLink.classes()).toContain("mobile-drawer-link--active");
      expect(aboutLink.attributes("aria-current")).toBe("page");
      expect(aboutLink.find(".active-indicator-dot").exists()).toBe(true);

      const homeLink = drawer.find('a[href="#/orientation"]');
      expect(homeLink.classes()).not.toContain("mobile-drawer-link--active");
      expect(homeLink.attributes("aria-current")).toBeUndefined();
    });
  });

  describe("Requirement F.1: Orientation Primary CTA", () => {
    it("preserves approved wording 'Explore the Portfolio Project' targeting /project-01", () => {
      expect(orientationContent.actions.primary.label).toBe("Explore the Portfolio Project");
      expect(orientationContent.actions.primary.to).toBe("/project-01");
      expect(orientationContent.actions.primary.ariaLabel).toBe("Explore the Portfolio Project");
    });
  });
});

