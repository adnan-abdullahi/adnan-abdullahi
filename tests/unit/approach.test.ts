import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import router from "../../app/src/router";
import type { EngineeringApproach } from "../../app/src/models/experience";
import approachContent from "../../app/src/content/approach";
import DimensionCard from "../../app/src/components/DimensionCard.vue";
import ApproachView from "../../app/src/views/ApproachView.vue";

describe("User Story 2: Engineering Approach Dimension & Navigation (T021)", () => {
  beforeEach(async () => {
    await router.push("/");
    await router.isReady();
  });

  describe("Domain Model Invariants (FR-005, FR-012, data-model.md Section 2.4)", () => {
    it("verifies EngineeringApproach domain model invariants", () => {
      const model: EngineeringApproach = {
        id: "engineering-approach",
        title: "Engineering Approach",
        parentProject: "project-01",
        governingPhilosophy:
          "Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity",
        sections: [
          {
            heading: "Methodology & Inquiry",
            body: "Understanding comes first, decisions are made under uncertainty.",
          },
        ],
        deeperInspectionDestination: "deep-engineering",
        returnDestination: "project-01",
      };

      expect(model.id).toBe("engineering-approach");
      expect(model.parentProject).toBe("project-01");
      expect(model.governingPhilosophy).toBe(
        "Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity",
      );
      expect(model.deeperInspectionDestination).toBe("deep-engineering");
      expect(model.returnDestination).toBe("project-01");
      expect(model.sections).toHaveLength(1);
      expect(model.sections[0].heading).toBe("Methodology & Inquiry");
    });
  });

  describe("Approved Content & Copy Fidelity (FR-012, FR-017, Penpot Board 03)", () => {
    it("contains exact approved text for title, eyebrow, and parent project", () => {
      expect(approachContent.id).toBe("engineering-approach");
      expect(approachContent.title).toBe("Engineering Approach");
      expect(approachContent.eyebrow).toBe("PROJECT 01 / DIMENSION");
      expect(approachContent.parentProject).toBe("project-01");
    });

    it("contains verbatim approved governing philosophy without modification", () => {
      expect(approachContent.governingPhilosophy).toBe(
        "Understand → Push Forward Under Uncertainty → Evaluate → Identify Gaps → Iterate → Establish Sufficient Clarity",
      );
    });

    it("contains verbatim approved technology principle and intro narrative", () => {
      expect(approachContent.intro).toBe(
        "The work is not treated as a straight path from idea to implementation. Understanding comes first, decisions are made under uncertainty, and the result is evaluated against the evidence available.",
      );
      expect(approachContent.technologyPrinciple).toBe(
        "Technology is treated as an instrument that assists engineering work. Human understanding, judgment, responsibility, and verification remain central.",
      );
    });

    it("contains approved action button destinations and labels matching Penpot", () => {
      expect(approachContent.actions.primary.label).toBe(
        "Continue to Deep Engineering",
      );
      expect(approachContent.actions.primary.to).toBe("/deep-engineering");
      expect(approachContent.actions.secondary.label).toBe(
        "Back to Project 01",
      );
      expect(approachContent.actions.secondary.to).toBe("/project-01");
      expect(approachContent.deeperInspectionDestination).toBe(
        "deep-engineering",
      );
      expect(approachContent.returnDestination).toBe("project-01");
    });

    it("contains structured methodology sections adhering to data model", () => {
      expect(approachContent.sections.length).toBeGreaterThanOrEqual(2);
      expect(approachContent.sections[0].heading).toBeDefined();
      expect(approachContent.sections[0].body).toBeDefined();
    });
  });

  describe("Route Navigation & Metadata Synchronization (FR-002, FR-005)", () => {
    it("synchronizes Engineering Approach route metadata correctly", async () => {
      await router.push("/approach");
      const current = router.currentRoute.value;

      expect(current.path).toBe("/approach");
      expect(current.name).toBe("engineering-approach");
      expect(current.meta.title).toBe("Engineering Approach");
      expect(current.meta.depth).toBe("dimension");
      expect(current.meta.depthLabel).toBe("Dimension");
      expect(current.meta.location).toBe("engineering-approach");
    });

    it("supports bidirectional navigation: Project 01 -> Approach -> Project 01", async () => {
      // 1. Start at Project 01
      await router.push("/project-01");
      expect(router.currentRoute.value.name).toBe("project-01");

      // 2. Branch to Engineering Approach (US2)
      await router.push("/approach");
      expect(router.currentRoute.value.name).toBe("engineering-approach");
      expect(router.currentRoute.value.meta.depth).toBe("dimension");

      // 3. Return to Project 01
      await router.push("/project-01");
      expect(router.currentRoute.value.name).toBe("project-01");
      expect(router.currentRoute.value.meta.depth).toBe("project-context");
    });

    it("supports deeper inspection traversal: Approach -> Deep Engineering", async () => {
      await router.push("/approach");
      expect(router.currentRoute.value.name).toBe("engineering-approach");

      await router.push("/deep-engineering");
      expect(router.currentRoute.value.name).toBe("deep-engineering");
      expect(router.currentRoute.value.meta.depth).toBe("deeper-inspection");
    });
  });

  describe("Component Verification: DimensionCard.vue (T024)", () => {
    it("renders title, summary, and action link correctly", () => {
      const wrapper = mount(DimensionCard, {
        props: {
          title: "Engineering Approach",
          summary:
            "How the work is understood, advanced, evaluated, and clarified.",
          to: "/approach",
          actionLabel: "Inspect Engineering Approach",
        },
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find(".dimension-card-title").text()).toBe(
        "Engineering Approach",
      );
      expect(wrapper.find(".dimension-card-summary").text()).toBe(
        "How the work is understood, advanced, evaluated, and clarified.",
      );
      const link = wrapper.find(".dimension-card-link");
      expect(link.exists()).toBe(true);
      expect(link.text()).toContain("Inspect Engineering Approach");
      expect(link.attributes("href")).toBe("#/approach");
    });

    it('omits action link when "to" prop is not provided', () => {
      const wrapper = mount(DimensionCard, {
        props: {
          title: "Static Dimension",
          summary: "A dimension without direct forward link.",
        },
      });

      expect(wrapper.find(".dimension-card-title").text()).toBe(
        "Static Dimension",
      );
      expect(wrapper.find(".dimension-card-link").exists()).toBe(false);
    });
  });

  describe("Component Verification: ApproachView.vue (T025)", () => {
    it("mounts and renders the full Engineering Approach view structure", async () => {
      await router.push("/approach");
      const wrapper = mount(ApproachView, {
        global: {
          plugins: [router],
        },
      });

      // Landmark & Header
      expect(wrapper.find(".approach-eyebrow").text()).toBe(
        "PROJECT 01 / DIMENSION",
      );
      expect(wrapper.find(".approach-title").text()).toBe(
        "Engineering Approach",
      );

      // Content & Principles
      expect(wrapper.find(".approach-intro").text()).toBe(
        approachContent.intro,
      );
      expect(wrapper.find(".approach-principle-quote").text()).toBe(
        approachContent.governingPhilosophy,
      );
      expect(wrapper.find(".approach-technology-principle").text()).toBe(
        approachContent.technologyPrinciple,
      );

      // Navigation Action Buttons
      const primaryBtn = wrapper.find(".action-btn--primary");
      expect(primaryBtn.exists()).toBe(true);
      expect(primaryBtn.text()).toContain("Continue to Deep Engineering");
      expect(primaryBtn.attributes("href")).toBe("#/deep-engineering");

      const secondaryBtn = wrapper.find(".action-btn--accent");
      expect(secondaryBtn.exists()).toBe(true);
      expect(secondaryBtn.text()).toContain("Back to Project 01");
      expect(secondaryBtn.attributes("href")).toBe("#/project-01");
    });
  });
});
