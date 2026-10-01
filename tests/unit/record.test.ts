import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import router from "../../app/src/router";
import type {
  EngineeringRecord,
  DecisionRecord,
} from "../../app/src/models/experience";
import recordContent from "../../app/src/content/record";
import approachContent from "../../app/src/content/approach";
import RecordView from "../../app/src/views/RecordView.vue";

describe("User Story 3: Engineering Record Dimension & Decisions (T026)", () => {
  beforeEach(async () => {
    await router.push("/");
    await router.isReady();
  });

  describe("Domain Model Invariants (FR-006, FR-015, data-model.md Section 2.5)", () => {
    it("verifies DecisionRecord and EngineeringRecord domain model invariants", () => {
      const decision: DecisionRecord = {
        id: "prototype-decision",
        topic: "PROTOTYPE",
        problem: "Redundant interaction on Orientation",
        decision: "Removed redundant interaction and verified 5-state topology",
        revisionHistory: ["Removed redundant open-overlay interaction"],
        status: "revised",
      };

      const recordModel: EngineeringRecord = {
        id: "engineering-record",
        title: "Engineering Record",
        parentProject: "project-01",
        chronologicalEntries: [decision],
        visibleUncertainties: [
          {
            topic: "Evidence Discoverability",
            description:
              "Gaps identified during human evaluation to be resolved",
            status: "unresolved",
          },
        ],
        deeperInspectionDestination: "deep-engineering",
        returnDestination: "project-01",
      };

      expect(recordModel.id).toBe("engineering-record");
      expect(recordModel.parentProject).toBe("project-01");
      expect(recordModel.chronologicalEntries).toHaveLength(1);
      expect(recordModel.chronologicalEntries[0].status).toBe("revised");
      expect(recordModel.visibleUncertainties[0].status).toBe("unresolved");
      expect(recordModel.deeperInspectionDestination).toBe("deep-engineering");
      expect(recordModel.returnDestination).toBe("project-01");
    });
  });

  describe("Approved Content & Copy Fidelity (FR-006, FR-015, FR-017, Penpot Board 04)", () => {
    it("contains exact approved text for title, eyebrow, and parent project", () => {
      expect(recordContent.id).toBe("engineering-record");
      expect(recordContent.title).toBe("Engineering Record");
      expect(recordContent.eyebrow).toBe("PROJECT 01 / DIMENSION");
      expect(recordContent.parentProject).toBe("project-01");
    });

    it("contains verbatim approved record intro narrative", () => {
      expect(recordContent.intro).toBe(
        "The record preserves how engineering understanding and decisions develop — including problems encountered, decisions made, revisions, verification, and what remains unresolved.",
      );
    });

    it("contains the three chronological decision entries matching Penpot columns verbatim", () => {
      expect(recordContent.chronologicalEntries).toHaveLength(3);

      // Column 1: DESIGN FOUNDATIONS
      const col1 = recordContent.chronologicalEntries[0];
      expect(col1.title).toBe("DESIGN FOUNDATIONS");
      expect(col1.body).toBe(
        "An apparent verification failure was investigated before changing the product. The discrepancy was traced to the inspection path and previous search assumption, after which the design foundations were accepted.",
      );

      // Column 2: PROTOTYPE
      const col2 = recordContent.chronologicalEntries[1];
      expect(col2.title).toBe("PROTOTYPE");
      expect(col2.body).toBe(
        "During prototype materialization, a redundant interaction and an unresolved navigation destination were discovered and corrected. The final topology was then inspected and verified.",
      );
      expect(col2.revisionHistory).toBeDefined();
      expect(col2.status).toBe("revised");

      // Column 3: VALIDATION
      const col3 = recordContent.chronologicalEntries[2];
      expect(col3.title).toBe("VALIDATION");
      expect(col3.body).toBe(
        "Human evaluation established that the prototype's structure, progressive depth, navigation, and Approach/Record distinction were understandable. It also exposed gaps in evidence discoverability, decision traceability, and revision/learning content.",
      );
    });

    it("contains visible uncertainties without manufactured certainty (FR-015)", () => {
      expect(recordContent.visibleUncertainties.length).toBeGreaterThanOrEqual(
        1,
      );
      expect(recordContent.visibleUncertainties[0].status).toBe("unresolved");
    });

    it("contains the verbatim concluding note preserving ongoing nature of the project", () => {
      expect(recordContent.concludingNote).toBe(
        "The record does not present the project as complete. It preserves what has been established, what has changed, and what remains uncertain.",
      );
    });

    it("contains approved action button destinations matching Penpot Board 04", () => {
      expect(recordContent.actions.primary.label).toBe(
        "Continue to Deep Engineering",
      );
      expect(recordContent.actions.primary.to).toBe("/deep-engineering");
      expect(recordContent.actions.secondary.label).toBe("Back to Project 01");
      expect(recordContent.actions.secondary.to).toBe("/project-01");
      expect(recordContent.deeperInspectionDestination).toBe(
        "deep-engineering",
      );
      expect(recordContent.returnDestination).toBe("project-01");
    });
  });

  describe("Clear Conceptual and Visual Distinction from Approach (FR-007)", () => {
    it("maintains distinct domain identifiers, titles, and purposes", () => {
      expect(recordContent.id).not.toBe(approachContent.id);
      expect(recordContent.title).toBe("Engineering Record");
      expect(approachContent.title).toBe("Engineering Approach");

      // Approach focuses on philosophy and methodology
      expect(approachContent).toHaveProperty("governingPhilosophy");
      // Record focuses on chronological decision entries and historical outcomes
      expect(recordContent).toHaveProperty("chronologicalEntries");
      expect(recordContent.chronologicalEntries.length).toBe(3);
    });
  });

  describe("Route Navigation & Metadata Synchronization (FR-002, FR-006)", () => {
    it("synchronizes Engineering Record route metadata correctly", async () => {
      await router.push("/record");
      const current = router.currentRoute.value;

      expect(current.path).toBe("/record");
      expect(current.name).toBe("engineering-record");
      expect(current.meta.title).toBe("Engineering Record");
      expect(current.meta.depth).toBe("dimension");
      expect(current.meta.depthLabel).toBe("Dimension");
      expect(current.meta.location).toBe("engineering-record");
    });

    it("supports bidirectional navigation: Project 01 -> Record -> Project 01", async () => {
      await router.push("/project-01");
      expect(router.currentRoute.value.name).toBe("project-01");

      await router.push("/record");
      expect(router.currentRoute.value.name).toBe("engineering-record");
      expect(router.currentRoute.value.meta.depth).toBe("dimension");

      await router.push("/project-01");
      expect(router.currentRoute.value.name).toBe("project-01");
      expect(router.currentRoute.value.meta.depth).toBe("project-context");
    });

    it("supports deeper inspection traversal: Record -> Deep Engineering", async () => {
      await router.push("/record");
      expect(router.currentRoute.value.name).toBe("engineering-record");

      await router.push("/deep-engineering");
      expect(router.currentRoute.value.name).toBe("deep-engineering");
      expect(router.currentRoute.value.meta.depth).toBe("deeper-inspection");
    });
  });

  describe("Component Verification: RecordView.vue (T029)", () => {
    it("mounts and renders the full Engineering Record 3-column view structure", async () => {
      await router.push("/record");
      const wrapper = mount(RecordView, {
        global: {
          plugins: [router],
        },
      });

      // Landmark & Header
      expect(wrapper.find(".record-eyebrow").text()).toBe(
        "PROJECT 01 / DIMENSION",
      );
      expect(wrapper.find(".record-title").text()).toBe("Engineering Record");

      // Intro narrative
      expect(wrapper.find(".record-intro").text()).toBe(recordContent.intro);

      // 3 Chronological Decision Columns
      const cards = wrapper.findAll(".record-column-card");
      expect(cards).toHaveLength(3);

      expect(cards[0].find(".record-column-title").text()).toBe(
        "DESIGN FOUNDATIONS",
      );
      expect(cards[0].find(".record-column-body").text()).toContain(
        "An apparent verification failure",
      );

      expect(cards[1].find(".record-column-title").text()).toBe("PROTOTYPE");
      expect(cards[1].find(".record-column-body").text()).toContain(
        "During prototype materialization",
      );

      expect(cards[2].find(".record-column-title").text()).toBe("VALIDATION");
      expect(cards[2].find(".record-column-body").text()).toContain(
        "Human evaluation established",
      );

      // Concluding Note
      expect(wrapper.find(".record-concluding-note").text()).toBe(
        recordContent.concludingNote,
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
