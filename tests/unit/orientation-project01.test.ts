import { describe, it, expect, beforeEach } from "vitest";
import router from "../../app/src/router";
import type { PortfolioOrientation, Project01 } from "../../app/src/models/experience";

describe("User Story 1: Orientation & Project 01 State Models & Routing (T016)", () => {
  beforeEach(async () => {
    await router.push("/");
    await router.isReady();
  });

  describe("Domain Model Invariants", () => {
    it("verifies PortfolioOrientation model invariants", () => {
      const orientationModel: PortfolioOrientation = {
        id: "orientation",
        title: "Portfolio Orientation",
        subtitle: "Entry & Context",
        description: "Orientation to professional engineering portfolio.",
        entryDestination: "project-01",
        metadata: {
          role: "Computer Scientist • Engineer",
          stage: "Stage 08 — Engineering Implementation",
        },
      };

      expect(orientationModel.id).toBe("orientation");
      expect(orientationModel.entryDestination).toBe("project-01");
      expect(orientationModel.metadata.role).toContain("Computer Scientist");
    });

    it("verifies Project01 central project model invariants", () => {
      const project01Model: Project01 = {
        id: "project-01",
        title: "Project 01",
        subtitle: "Portfolio Experience",
        overview: "Central professional engineering project experience.",
        dimensions: {
          approachId: "engineering-approach",
          recordId: "engineering-record",
        },
        returnDestination: "orientation",
      };

      expect(project01Model.id).toBe("project-01");
      expect(project01Model.returnDestination).toBe("orientation");
      expect(project01Model.dimensions.approachId).toBe("engineering-approach");
      expect(project01Model.dimensions.recordId).toBe("engineering-record");
    });
  });

  describe("Route Navigation & Metadata Synchronization", () => {
    it('redirects root "/" to "/orientation"', async () => {
      await router.push("/");
      expect(router.currentRoute.value.path).toBe("/orientation");
      expect(router.currentRoute.value.name).toBe("orientation");
    });

    it("synchronizes Orientation route metadata correctly", async () => {
      await router.push("/orientation");
      const current = router.currentRoute.value;

      expect(current.path).toBe("/orientation");
      expect(current.meta.title).toBe("Portfolio Orientation");
      expect(current.meta.depth).toBe("entry");
      expect(current.meta.depthLabel).toBe("Entry Context");
      expect(current.meta.location).toBe("orientation");
    });

    it("synchronizes Project 01 route metadata correctly", async () => {
      await router.push("/project-01");
      const current = router.currentRoute.value;

      expect(current.path).toBe("/project-01");
      expect(current.meta.title).toBe("Project 01 — Portfolio Experience");
      expect(current.meta.depth).toBe("project-context");
      expect(current.meta.depthLabel).toBe("Project Context");
      expect(current.meta.location).toBe("project-01");
    });

    it("supports bidirectional forward and return traversal between Orientation and Project 01", async () => {
      // 1. Start at Orientation
      await router.push("/orientation");
      expect(router.currentRoute.value.name).toBe("orientation");

      // 2. Forward transition to Project 01 (FR-003, US1)
      await router.push("/project-01");
      expect(router.currentRoute.value.name).toBe("project-01");
      expect(router.currentRoute.value.meta.depth).toBe("project-context");

      // 3. Contextual return transition to Orientation (FR-004, US1)
      await router.push("/orientation");
      expect(router.currentRoute.value.name).toBe("orientation");
      expect(router.currentRoute.value.meta.depth).toBe("entry");
    });
  });

  describe("Reconciled Phase 3 Content & CTA Invariants (Decisions 3, 4, 5)", () => {
    it("verifies Orientation primary CTA is 'Explore the Engineering Record' targeting /project-01", async () => {
      const { orientationContent } = await import("../../app/src/content/orientation");
      expect(orientationContent.actions.primary.label).toBe("Explore the Engineering Record");
      expect(orientationContent.actions.primary.to).toBe("/project-01");
      expect(orientationContent.actions.secondary.to).toBe("/approach");
    });

    it("verifies Project 01 contains two-column dimensional links and return target", async () => {
      const { project01Content } = await import("../../app/src/content/project01");
      expect(project01Content.dimensions.items).toHaveLength(2);
      expect(project01Content.dimensions.items[0].to).toBe("/approach");
      expect(project01Content.dimensions.items[1].to).toBe("/record");
      expect(project01Content.returnDestination.to).toBe("/orientation");
    });
  });
});
