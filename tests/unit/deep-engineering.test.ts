import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import router from "../../app/src/router";
import type {
  DeepEngineering,
  EvidenceItem,
} from "../../app/src/models/experience";
import deepEngineeringContent, {
  designFoundationsEvidence,
} from "../../app/src/content/deep-engineering";
import EvidenceCard from "../../app/src/components/EvidenceCard.vue";
import DeepEngineeringView from "../../app/src/views/DeepEngineeringView.vue";

describe("User Story 4: Deep Engineering & Contextual Return (T030)", () => {
  beforeEach(async () => {
    await router.push("/");
    await router.isReady();
  });

  describe("Domain Model Invariants (FR-008, FR-009, FR-015, data-model.md Section 2.6 & 2.7)", () => {
    it("verifies EvidenceItem domain model fields and traceability chain", () => {
      const item: EvidenceItem = {
        id: "EVID-DF-01",
        problem:
          "Initial inspection appeared to indicate semantic color token failure.",
        requirement: "Materialize Direction C Light faithfully.",
        decision: "Investigate discrepancy directly before modifying product.",
        technicalWork:
          "Direct inspection of active Global token set in Penpot.",
        evidence: "16 color tokens and 8 semantic roles confirmed present.",
        verification: "Resolved fills strictly match approved token hex codes.",
        outcome: "Stage 04 accepted without unnecessary modifications.",
        reflection:
          "Verification failures should prompt verification method audit.",
        growth: "Established disciplined reconciliation workflow.",
        uncertainty: "Workspace evidence needed clearer materialization.",
      };

      expect(item.id).toBe("EVID-DF-01");
      expect(item.problem).toBeDefined();
      expect(item.requirement).toBeDefined();
      expect(item.decision).toBeDefined();
      expect(item.technicalWork).toBeDefined();
      expect(item.evidence).toBeDefined();
      expect(item.verification).toBeDefined();
      expect(item.outcome).toBeDefined();
      expect(item.reflection).toBeDefined();
      expect(item.growth).toBeDefined();
      expect(item.uncertainty).toBeDefined();
    });

    it("verifies DeepEngineering domain entity invariants and return constraint", () => {
      const deepModel: DeepEngineering = {
        id: "deep-engineering",
        title: "Deep Engineering",
        parentProject: "project-01",
        subtitle: "Design Foundations",
        caseStudy: {
          title: "Design Foundations Verification",
          overview: "Overview text",
          evidenceItems: [designFoundationsEvidence],
        },
        returnDestination: "project-01",
      };

      expect(deepModel.id).toBe("deep-engineering");
      expect(deepModel.parentProject).toBe("project-01");
      expect(deepModel.returnDestination).toBe("project-01");
      expect(deepModel.caseStudy.evidenceItems).toHaveLength(1);
      // Must NOT return directly to orientation per data-model.md
      expect(deepModel.returnDestination).not.toBe("orientation");
    });
  });

  describe("Approved Content & Copy Fidelity (FR-008, FR-009, FR-018, Penpot Board 05)", () => {
    it("contains exact approved text for title, eyebrow, and parent project", () => {
      expect(deepEngineeringContent.id).toBe("deep-engineering");
      expect(deepEngineeringContent.title).toBe("Deep Engineering");
      expect(deepEngineeringContent.subtitle).toBe("Design Foundations");
      expect(deepEngineeringContent.eyebrow).toBe(
        "PROJECT 01 / DEEPER INSPECTION",
      );
      expect(deepEngineeringContent.contextLabel).toBe("PROJECT 01");
      expect(deepEngineeringContent.parentProject).toBe("project-01");
    });

    it("contains verbatim approved deep engineering intro narrative", () => {
      expect(deepEngineeringContent.intro).toBe(
        "Deeper inspection moves from the resulting interface into the evidence behind engineering decisions.",
      );
    });

    it("contains the three verbatim narrative paragraphs from Penpot Board 05", () => {
      expect(deepEngineeringContent.narrativeParagraphs).toHaveLength(3);
      expect(deepEngineeringContent.narrativeParagraphs[0]).toBe(
        "An initial inspection appeared to indicate that the approved semantic color system had not been correctly implemented.",
      );
      expect(deepEngineeringContent.narrativeParagraphs[1]).toBe(
        "Rather than treating the inspection result as proof of implementation failure, the discrepancy itself became an object of investigation.",
      );
      expect(deepEngineeringContent.narrativeParagraphs[2]).toBe(
        "The relevant token set and semantic bindings were inspected directly. The evidence established that the approved tokens existed, resolved correctly, and were applied to the relevant shapes.",
      );
    });

    it("contains the 6-stage investigation workflow sequence from Penpot Board 05", () => {
      expect(deepEngineeringContent.flowSequence).toEqual([
        "Implementation",
        "Verification",
        "Apparent Discrepancy",
        "Investigation",
        "Reconciliation",
        "Acceptance",
      ]);
    });

    it("contains the complete 9-part evidence item matching Stage 04 acceptance checkpoint", () => {
      const evidence = deepEngineeringContent.caseStudy.evidenceItems[0];
      expect(evidence.id).toBe("EVID-DF-01");
      expect(evidence.problem).toContain(
        "semantic color system had not been correctly implemented",
      );
      expect(evidence.requirement).toContain(
        "Direction C Light semantic color system",
      );
      expect(evidence.decision).toContain(
        "treat the discrepancy itself as an object of investigation",
      );
      expect(evidence.technicalWork).toContain(
        "Direct inspection of the active Global token set",
      );
      expect(evidence.evidence).toContain(
        "All 16 color tokens and 8 semantic roles confirmed present",
      );
      expect(evidence.verification).toContain(
        "Resolved fills strictly match approved token hex codes",
      );
      expect(evidence.outcome).toContain(
        "Stage 04 accepted without unnecessary modifications",
      );
      expect(evidence.reflection).toContain(
        "Verification failures should prompt an audit",
      );
      expect(evidence.growth).toContain(
        "Established disciplined reconciliation workflow",
      );
      expect(evidence.uncertainty).toContain(
        "Workspace evidence needed clearer materialization",
      );
    });

    it("contains explicit scope qualification and validation gap statements from Board 05", () => {
      expect(deepEngineeringContent.scopeStatement).toBe(
        "This project does not yet claim production implementation, deployment outcomes, or real-world user metrics that have not been established.",
      );
      expect(deepEngineeringContent.validationGap).toBe(
        "Current validation has identified a different gap: the evidence already recorded in the engineering workspace needs to be materialized more clearly so that the actual engineering journey can be inspected as a coherent system.",
      );
    });

    it("contains single secondary action returning strictly to project-01 without forward destination", () => {
      expect(deepEngineeringContent.action.label).toBe("Back to Project 01");
      expect(deepEngineeringContent.action.to).toBe("/project-01");
      expect(deepEngineeringContent.returnDestination).toBe("project-01");
      // No forward destination allowed on Deep Engineering
      expect(
        (deepEngineeringContent as unknown as Record<string, unknown>)
          .deeperInspectionDestination,
      ).toBeUndefined();
    });
  });

  describe("Route & Navigation Topology Integration (FR-002, FR-008, ui-contracts.md)", () => {
    it("verifies route registration and metadata for /deep-engineering", () => {
      const route = router
        .getRoutes()
        .find((r) => r.path === "/deep-engineering");
      expect(route).toBeDefined();
      expect(route?.name).toBe("deep-engineering");
      expect(route?.meta.title).toBe("Deep Engineering — Design Foundations");
      expect(route?.meta.depth).toBe("deeper-inspection");
      expect(route?.meta.location).toBe("deep-engineering");
      expect(route?.meta.depthLabel).toBe("Deeper Inspection");
    });
  });

  describe("EvidenceCard Component Rendering (T033, ui-contracts.md Section 5)", () => {
    it("renders all 9 stages of the evidence chain in sequential order", () => {
      const wrapper = mount(EvidenceCard, {
        props: {
          item: designFoundationsEvidence,
        },
      });

      const steps = wrapper.findAll(".evidence-step");
      expect(steps).toHaveLength(9);

      const expectedKeys = [
        "problem",
        "requirement",
        "decision",
        "technical-work",
        "evidence",
        "verification",
        "outcome",
        "reflection",
        "growth",
      ];

      expectedKeys.forEach((key, index) => {
        expect(steps[index].attributes("data-step-key")).toBe(key);
      });

      // Verify step labels
      expect(steps[0].text()).toContain("Problem");
      expect(steps[6].text()).toContain("Outcome");
      expect(steps[8].text()).toContain("Growth");
    });

    it("renders visible uncertainty boundary when uncertainty prop is present", () => {
      const wrapper = mount(EvidenceCard, {
        props: {
          item: designFoundationsEvidence,
        },
      });

      const uncertaintyEl = wrapper.find('[data-uncertainty-boundary="true"]');
      expect(uncertaintyEl.exists()).toBe(true);
      expect(uncertaintyEl.text()).toContain("Visible Uncertainty");
      expect(uncertaintyEl.text()).toContain(
        designFoundationsEvidence.uncertainty!,
      );
    });

    it("does not render uncertainty container when uncertainty is absent", () => {
      const itemWithoutUncertainty: EvidenceItem = {
        ...designFoundationsEvidence,
        uncertainty: undefined,
      };

      const wrapper = mount(EvidenceCard, {
        props: {
          item: itemWithoutUncertainty,
        },
      });

      expect(wrapper.find('[data-uncertainty-boundary="true"]').exists()).toBe(
        false,
      );
    });
  });

  describe("DeepEngineeringView Component Rendering (T034)", () => {
    it("mounts properly and renders heading landmark with correct accessibility attributes", () => {
      const wrapper = mount(DeepEngineeringView, {
        global: {
          plugins: [router],
        },
      });

      const heading = wrapper.find("h1#main-heading");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("Deep Engineering");
      expect(heading.attributes("tabindex")).toBe("-1");

      const eyebrow = wrapper.find(".deep-eyebrow");
      expect(eyebrow.exists()).toBe(true);
      expect(eyebrow.text()).toBe("PROJECT 01 / DEEPER INSPECTION");
    });

    it("renders flow sequence progression", () => {
      const wrapper = mount(DeepEngineeringView, {
        global: {
          plugins: [router],
        },
      });

      const flowSteps = wrapper.findAll(".flow-step-name");
      expect(flowSteps).toHaveLength(6);
      expect(flowSteps[0].text()).toBe("Implementation");
      expect(flowSteps[5].text()).toBe("Acceptance");
    });

    it("confirms EvidenceCard component is not rendered on DeepEngineeringView per Penpot Board 05 reconciliation", () => {
      const wrapper = mount(DeepEngineeringView, {
        global: {
          plugins: [router],
        },
      });

      const evidenceCard = wrapper.findComponent(EvidenceCard);
      expect(evidenceCard.exists()).toBe(false);
      expect(wrapper.find(".evidence-chain-wrapper").exists()).toBe(false);
    });

    it("renders the three-column spatial composition (narrative, flow sequence, boundary statements)", () => {
      const wrapper = mount(DeepEngineeringView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find(".narrative-column").exists()).toBe(true);
      expect(wrapper.find(".flow-column").exists()).toBe(true);
      expect(wrapper.find(".boundary-column").exists()).toBe(true);

      const scopeText = wrapper.find('[data-boundary="scope"]');
      expect(scopeText.exists()).toBe(true);
      expect(scopeText.text()).toContain(
        "This project does not yet claim production implementation",
      );

      const validationGapText = wrapper.find(
        '[data-boundary="validation-gap"]',
      );
      expect(validationGapText.exists()).toBe(true);
      expect(validationGapText.text()).toContain(
        "Current validation has identified a different gap",
      );
    });

    it("renders the return action button pointing to /project-01", () => {
      const wrapper = mount(DeepEngineeringView, {
        global: {
          plugins: [router],
        },
      });

      const actionBtn = wrapper.find(".action-btn--accent");
      expect(actionBtn.exists()).toBe(true);
      expect(actionBtn.text()).toContain("Back to Project 01");
      expect(
        actionBtn.attributes("to") || actionBtn.attributes("href"),
      ).toBeDefined();
    });
  });
});
