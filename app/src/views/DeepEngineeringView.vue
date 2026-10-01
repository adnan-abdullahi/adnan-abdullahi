<script setup lang="ts">
import { RouterLink } from "vue-router";
import deepEngineeringContent from "@/content/deep-engineering";

const content = deepEngineeringContent;
</script>

<template>
  <div class="deep-engineering-view">
    <!-- Header Landmark (Penpot Eyebrow + Screen Title) -->
    <header class="deep-header">
      <p class="deep-eyebrow">
        {{ content.eyebrow }}
      </p>
      <h1 id="main-heading" class="deep-title" tabindex="-1">
        {{ content.title }}
      </h1>
    </header>

    <!-- Three-Column Spatial Composition (Penpot Board 05) -->
    <div class="deep-columns">
      <!-- Left Column: Intro, Case Study Subtitle, Narrative (Penpot Board 05) -->
      <section
        class="narrative-column"
        aria-label="Deep Engineering Narrative and Case Study"
      >
        <p class="deep-intro">
          {{ content.intro }}
        </p>

        <h2 class="case-study-subtitle">
          {{ content.subtitle }}
        </h2>

        <div class="case-study-narrative">
          <p
            v-for="(para, idx) in content.narrativeParagraphs"
            :key="idx"
            class="narrative-paragraph"
          >
            {{ para }}
          </p>
        </div>
      </section>

      <!-- Middle Column: Flow / Workflow Sequence (Penpot Board 05) -->
      <section
        class="flow-column"
        aria-label="Reconciliation Workflow Sequence"
      >
        <ol class="flow-sequence-list" aria-label="Workflow steps">
          <li
            v-for="(step, index) in content.flowSequence"
            :key="step"
            class="flow-step"
          >
            <span class="flow-step-name">{{ step }}</span>
            <span
              v-if="index < content.flowSequence.length - 1"
              class="flow-step-arrow"
              aria-hidden="true"
            >
              ↓
            </span>
          </li>
        </ol>
      </section>

      <!-- Right Column: Open Textual Scope & Validation Gap (Penpot Board 05) -->
      <aside
        class="boundary-column"
        aria-label="Scope and Validation"
      >
        <p class="boundary-text scope-statement" data-boundary="scope">
          {{ content.scopeStatement }}
        </p>

        <p class="boundary-text validation-gap" data-boundary="validation-gap">
          {{ content.validationGap }}
        </p>
      </aside>
    </div>

    <!-- Return Action Navigation (Penpot Board 05: Single Secondary Return Action) -->
    <div
      class="deep-actions"
      aria-label="Deep Engineering Navigation Actions"
    >
      <RouterLink
        :to="content.action.to"
        class="action-btn action-btn--accent"
        :aria-label="content.action.ariaLabel"
      >
        <span>{{ content.action.label }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.deep-engineering-view {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .deep-engineering-view {
    padding: var(--space-12) var(--space-8);
  }
}

@media (min-width: 1025px) {
  .deep-engineering-view {
    padding: 44px 80px 64px 80px;
  }
}

/* Header Landmark */
.deep-header {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.deep-eyebrow {
  font-family: var(--font-family-base);
  font-size: clamp(0.875rem, 1.25vw, 1.125rem);
  font-weight: 600;
  line-height: 1.5;
  color: #52606d;
  letter-spacing: 0;
  margin: 0;
}

.deep-title {
  font-family: var(--font-family-base);
  font-size: clamp(2.25rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0;
  color: #18212b;
  margin: 0;
  outline: none;
}

/* Three-Column Spatial Composition (Penpot Board 05) */
.deep-columns {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  margin-top: 36px;
}

@media (min-width: 1025px) {
  .deep-columns {
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0;
  }
}

/* Left Column: Narrative & Case Study (w ≈ 640px) */
.narrative-column {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

@media (min-width: 1025px) {
  .narrative-column {
    width: 640px;
    max-width: 640px;
    flex-shrink: 0;
    gap: 0;
  }
}

.deep-intro {
  font-family: var(--font-family-base);
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  font-weight: 600;
  line-height: 1.4;
  color: #18212b;
  max-width: 640px;
  margin: 0;
}

.case-study-subtitle {
  font-family: var(--font-family-base);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5;
  color: #245b8f;
  margin: 0;
  margin-top: 6px;
}

.case-study-narrative {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 640px;
  margin-top: 11px;
}

.narrative-paragraph {
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #52606d;
  margin: 0;
}

/* Middle Column: Flow / Workflow Sequence (w ≈ 165px) */
.flow-column {
  width: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 1025px) {
  .flow-column {
    width: 165px;
    margin-left: 40px;
    flex-shrink: 0;
  }
}

.flow-sequence-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.flow-step-name {
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: #18212b;
}

.flow-step-arrow {
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: #18212b;
  margin: 0;
}

/* Right Column: Open Textual Scope & Validation Gap (w ≈ 360px) */
.boundary-column {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (min-width: 1025px) {
  .boundary-column {
    width: 360px;
    margin-left: 75px;
    flex-shrink: 0;
    gap: 51px;
  }
}

.boundary-text {
  font-family: var(--font-family-base);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #52606d;
  margin: 0;
}

/* Return Action Navigation */
.deep-actions {
  display: flex;
  margin-top: var(--space-8);
}

@media (min-width: 1025px) {
  .deep-actions {
    margin-top: 68px;
  }
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  width: 250px;
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid transparent;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
  cursor: pointer;
  box-sizing: border-box;
}

.action-btn:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

.action-btn--accent {
  background-color: #e3eef7;
  color: #245b8f;
  border-color: #e3eef7;
}

.action-btn--accent:hover {
  background-color: #d2e4f2;
}

@media (max-width: 600px) {
  .deep-actions {
    width: 100%;
  }

  .action-btn {
    width: 100%;
    min-width: auto;
  }
}
</style>

