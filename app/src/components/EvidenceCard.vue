<script setup lang="ts">
import type { EvidenceItem } from "@/models/experience";

interface Props {
  item: EvidenceItem;
}

defineProps<Props>();

interface ChainStep {
  key: string;
  label: string;
  value: string;
}

const getSteps = (evidence: EvidenceItem): ChainStep[] => [
  { key: "problem", label: "Problem", value: evidence.problem },
  { key: "requirement", label: "Requirement", value: evidence.requirement },
  { key: "decision", label: "Decision", value: evidence.decision },
  {
    key: "technical-work",
    label: "Technical Work",
    value: evidence.technicalWork,
  },
  { key: "evidence", label: "Evidence", value: evidence.evidence },
  { key: "verification", label: "Verification", value: evidence.verification },
  { key: "outcome", label: "Outcome", value: evidence.outcome },
  { key: "reflection", label: "Reflection", value: evidence.reflection },
  { key: "growth", label: "Growth", value: evidence.growth },
];
</script>

<template>
  <article
    class="evidence-card"
    :data-evidence-id="item.id"
    aria-label="Atomic Evidence Chain"
  >
    <div class="evidence-card-header">
      <span class="evidence-id-badge">{{ item.id }}</span>
      <h3 class="evidence-card-title">Evidence &amp; Traceability Chain</h3>
    </div>

    <!-- 9-Stage Sequential Relationship Chain -->
    <ol class="evidence-chain-list" aria-label="Sequential Evidence Chain">
      <li
        v-for="(step, index) in getSteps(item)"
        :key="step.key"
        class="evidence-step"
        :data-step-key="step.key"
      >
        <div class="step-marker" aria-hidden="true">
          <span class="step-number">{{ index + 1 }}</span>
        </div>
        <div class="step-content">
          <h4 class="step-label">{{ step.label }}</h4>
          <p class="step-value">{{ step.value }}</p>
        </div>
      </li>
    </ol>

    <!-- Visible Uncertainty / Unresolved Boundary (Mandatory if present per ui-contracts.md) -->
    <div
      v-if="item.uncertainty"
      class="evidence-uncertainty"
      data-uncertainty-boundary="true"
      role="note"
      aria-label="Visible Uncertainty"
    >
      <div class="uncertainty-header">
        <span class="uncertainty-badge">Visible Uncertainty</span>
        <h4 class="uncertainty-title">Scope &amp; Uncertainty Boundary</h4>
      </div>
      <p class="uncertainty-description">{{ item.uncertainty }}</p>
    </div>
  </article>
</template>

<style scoped>
.evidence-card {
  background-color: var(--color-surface-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .evidence-card {
    padding: var(--space-8);
    gap: var(--space-6);
  }
}

.evidence-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid var(--color-border-subtle);
  padding-bottom: var(--space-4);
}

.evidence-id-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background-color: var(--color-surface-accent);
  color: var(--color-interactive-primary);
  font-family: var(--font-family-base);
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.evidence-card-title {
  font-family: var(--font-family-base);
  font-size: 1.125rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  color: var(--color-text-primary);
  margin: 0;
}

/* Sequential Evidence Chain List */
.evidence-chain-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  position: relative;
}

.evidence-step {
  display: flex;
  gap: var(--space-4);
  position: relative;
}

.step-marker {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--color-surface-accent);
  color: var(--color-interactive-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.step-number {
  font-family: var(--font-family-base);
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex-grow: 1;
}

.step-label {
  font-family: var(--font-family-base);
  font-size: 0.875rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  color: var(--color-interactive-primary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin: 0;
}

.step-value {
  font-family: var(--font-family-base);
  font-size: var(--type-body-size);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0;
}

/* Visible Uncertainty Container */
.evidence-uncertainty {
  background-color: #f7fafc;
  border: 1px solid var(--color-border-subtle);
  border-left: 4px solid var(--color-interactive-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.uncertainty-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.uncertainty-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background-color: var(--color-surface-accent);
  color: var(--color-interactive-primary);
  font-family: var(--font-family-base);
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.04em;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.uncertainty-title {
  font-family: var(--font-family-base);
  font-size: 0.875rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  color: var(--color-text-primary);
  margin: 0;
}

.uncertainty-description {
  font-family: var(--font-family-base);
  font-size: 0.875rem;
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0;
}
</style>
