import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import router from "../../app/src/router";
import type { ExperienceLocation } from "../../app/src/models/experience";
import aboutContent from "../../app/src/content/about";
import AboutView from "../../app/src/views/AboutView.vue";
import Header from "../../app/src/components/Header.vue";
import MobileNav from "../../app/src/components/MobileNav.vue";

describe("About Page Implementation & Fidelity", () => {
  beforeEach(async () => {
    await router.push("/");
    await router.isReady();
  });

  describe("Routing & Navigation Topology Integration", () => {
    it("verifies route registration and metadata for /about", () => {
      const route = router.getRoutes().find((r) => r.path === "/about");
      expect(route).toBeDefined();
      expect(route?.name).toBe("about");
      expect(route?.meta.title).toBe("About");
      expect(route?.meta.location).toBe("about");
      expect(route?.meta.depth).toBe("entry");
      expect(route?.meta.depthLabel).toBe("About");
    });

    it("verifies ExperienceLocation type supports 'about'", () => {
      const loc: ExperienceLocation = "about";
      expect(loc).toBe("about");
    });
  });

  describe("Content Fidelity: Exact Frozen Step F Source of Truth", () => {
    it("contains exact approved page title and section headings", () => {
      expect(aboutContent.id).toBe("about");
      expect(aboutContent.pageTitle).toBe("About");
      expect(aboutContent.aboutMe.heading).toBe("About Me");
      expect(aboutContent.howIWork.heading).toBe("How I Work");
      expect(aboutContent.whatIWorkOn.heading).toBe("What I Work On");
      expect(aboutContent.whereImGoing.heading).toBe("Where I'm Going");
      expect(aboutContent.letsConnect.heading).toBe("Let's Connect");
    });

    it("contains exact identity name and role in About Me", () => {
      expect(aboutContent.aboutMe.name).toBe("Adnan Abdullahi");
      expect(aboutContent.aboutMe.role).toBe("Computer Scientist • Engineer");
    });

    it("contains exactly 3 approved paragraphs in About Me", () => {
      expect(aboutContent.aboutMe.paragraphs).toHaveLength(3);
      expect(aboutContent.aboutMe.paragraphs[0]).toContain(
        "developing my practice around understanding problems, making deliberate decisions",
      );
      expect(aboutContent.aboutMe.paragraphs[1]).toContain(
        "I do not see engineering as simply writing code or producing technology",
      );
      expect(aboutContent.aboutMe.paragraphs[2]).toContain(
        "I believe engineering is more than building technology",
      );
    });

    it("contains all approved sentences in How I Work including 'something tangible' and AI tools", () => {
      expect(aboutContent.howIWork.paragraphs).toHaveLength(3);
      expect(aboutContent.howIWork.paragraphs[0]).toBe(
        "My practice develops through investigation, decision-making, building, verification, and learning.",
      );
      expect(aboutContent.howIWork.paragraphs[1]).toContain(
        "I build in order to turn understanding into something tangible.",
      );
      expect(aboutContent.howIWork.paragraphs[1]).toContain(
        "I verify what has actually been established rather than relying only on the appearance of success.",
      );
      expect(aboutContent.howIWork.paragraphs[1]).toContain(
        "treat that gap as part of the engineering work rather than something to hide.",
      );
      expect(aboutContent.howIWork.paragraphs[2]).toContain(
        "Modern tools, including AI-assisted tools, can support investigation",
      );
      expect(aboutContent.howIWork.closingPrinciple).toBe(
        "The technology supports the work. Human understanding and engineering judgment remain central.",
      );
    });

    it("contains all 3 approved paragraphs in What I Work On", () => {
      expect(aboutContent.whatIWorkOn.paragraphs).toHaveLength(3);
      expect(aboutContent.whatIWorkOn.paragraphs[0]).toContain(
        "working through meaningful problems and turning that investigation into useful systems",
      );
      expect(aboutContent.whatIWorkOn.paragraphs[1]).toContain(
        "opportunities to develop my ability to understand problems",
      );
      expect(aboutContent.whatIWorkOn.paragraphs[2]).toContain(
        "This portfolio exists to make that development inspectable.",
      );
    });

    it("contains exactly 2 approved paragraphs in Where I'm Going", () => {
      expect(aboutContent.whereImGoing.paragraphs).toHaveLength(2);
      expect(aboutContent.whereImGoing.paragraphs[0]).toContain(
        "My engineering practice is still developing.",
      );
      expect(aboutContent.whereImGoing.paragraphs[1]).toContain(
        "I do not see learning as something that ends when a particular skill, project, or stage is completed.",
      );
    });

    it("contains exactly 2 approved paragraphs in Let's Connect and approved CTA", () => {
      expect(aboutContent.letsConnect.paragraphs).toHaveLength(2);
      expect(aboutContent.letsConnect.paragraphs[0]).toBe(
        "Perhaps the work has given you an idea, raised a problem worth exploring, or revealed a possibility worth turning into something real.",
      );
      expect(aboutContent.letsConnect.paragraphs[1]).toBe(
        "Take it one step further. Bring the idea, problem, or possibility into a conversation, and let's explore what it could become.",
      );
      expect(aboutContent.letsConnect.cta.label).toBe("Bring an Idea");
      expect(aboutContent.letsConnect.cta.to).toBe("/contact");
      expect(aboutContent.letsConnect.cta.label).not.toBe("Contact");
      expect(aboutContent.letsConnect.cta.label).not.toBe("[Contact]");
    });
  });

  describe("AboutView Component Rendering & Accessibility", () => {
    it("renders h1#main-heading with tabindex -1 for focus management", () => {
      const wrapper = mount(AboutView, {
        global: {
          plugins: [router],
        },
      });

      const heading = wrapper.find("h1#main-heading");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("About");
      expect(heading.attributes("tabindex")).toBe("-1");
    });

    it("renders all 5 semantic sections with accessible labelledby headings", () => {
      const wrapper = mount(AboutView, {
        global: {
          plugins: [router],
        },
      });

      const sections = wrapper.findAll("section.about-section");
      expect(sections).toHaveLength(5);

      const sectionHeadings = wrapper.findAll("h2.section-heading");
      expect(sectionHeadings).toHaveLength(5);
      expect(sectionHeadings[0].text()).toBe("About Me");
      expect(sectionHeadings[1].text()).toBe("How I Work");
      expect(sectionHeadings[2].text()).toBe("What I Work On");
      expect(sectionHeadings[3].text()).toBe("Where I'm Going");
      expect(sectionHeadings[4].text()).toBe("Let's Connect");
    });

    it("renders identity name and role in Section 1", () => {
      const wrapper = mount(AboutView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find(".identity-name").text()).toBe("Adnan Abdullahi");
      expect(wrapper.find(".identity-role").text()).toBe(
        "Computer Scientist • Engineer",
      );
    });

    it("renders closing principle in Section 2", () => {
      const wrapper = mount(AboutView, {
        global: {
          plugins: [router],
        },
      });

      const principle = wrapper.find(".closing-principle");
      expect(principle.exists()).toBe(true);
      expect(principle.text()).toBe(
        "The technology supports the work. Human understanding and engineering judgment remain central.",
      );
    });

    it("renders CTA button with label 'Bring an Idea' pointing to /contact", () => {
      const wrapper = mount(AboutView, {
        global: {
          plugins: [router],
        },
      });

      const cta = wrapper.find(".btn-cta");
      expect(cta.exists()).toBe(true);
      expect(cta.text()).toBe("Bring an Idea");
      expect(cta.attributes("href")).toBe("#/contact");
    });
  });

  describe("Header & Mobile Navigation Integration", () => {
    it("renders active About link in Header when on /about route without project-tag", async () => {
      await router.push("/about");
      await router.isReady();

      const wrapper = mount(Header, {
        global: {
          plugins: [router],
        },
      });

      const aboutLink = wrapper.find('a[href="#/about"]');
      expect(aboutLink.exists()).toBe(true);
      expect(aboutLink.classes()).toContain("nav-link--active");

      // Verify no project context tag on About page (open header)
      expect(wrapper.find(".project-tag").exists()).toBe(false);
    });

    it("renders mobile navigation with Return to Orientation when on /about", async () => {
      await router.push("/about");
      await router.isReady();

      const wrapper = mount(MobileNav, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find(".mobile-location-label").text()).toBe("About");
      const returnBtn = wrapper.find(".mobile-return-btn");
      expect(returnBtn.exists()).toBe(true);
      expect(returnBtn.attributes("href")).toBe("#/orientation");
      expect(returnBtn.text()).toContain("Orientation");
    });
  });
});
