<script setup lang="ts">
import { RouterLink } from "vue-router";
import project01Content from "@/content/project01";

const content = project01Content;
</script>

<template>
  <div class="project01-view">
    <!-- Project Header Landmark (Penpot Eyebrow + Screen Title) -->
    <header class="project-header">
      <p class="project-eyebrow">
        {{ content.badge }}
      </p>
      <h1 id="main-heading" class="project-title" tabindex="-1">
        {{ content.title }}
      </h1>
      <div class="header-divider" role="separator" aria-hidden="true"></div>
    </header>

    <!-- Penpot Two-Column Composition (Decision 4) -->
    <div class="project01-columns">
      <!-- Left Column: Narrative, Context & Actions (~760px) -->
      <section
        class="narrative-column"
        aria-label="Project Narrative and Actions"
      >
        <h2 class="project-definition">
          {{ content.overview.heading }}
        </h2>

        <div class="project-purpose">
          <p
            v-for="(para, index) in content.overview.paragraphs"
            :key="index"
            class="purpose-text"
          >
            {{ para }}
          </p>
        </div>

        <!-- Action Navigation Gateway: Primary (Approach) & Secondary (Record) -->
        <div class="project-actions" aria-label="Project Navigation Actions">
          <RouterLink
            to="/approach"
            class="action-btn action-btn--primary"
            aria-label="Inspect Engineering Approach"
          >
            <span>Inspect Engineering Approach</span>
          </RouterLink>

          <RouterLink
            to="/record"
            class="action-btn action-btn--secondary"
            aria-label="Inspect Engineering Record"
          >
            <span>Inspect Engineering Record</span>
          </RouterLink>
        </div>
      </section>

      <!-- Right Column: Approach & Record Dimension Summaries (~340px) -->
      <aside class="dimensions-column" aria-label="Project Dimension Summaries">
        <article class="dimension-summary">
          <h2 class="dimension-summary-title">Engineering Approach</h2>
          <p class="dimension-summary-text">
            How the work is understood, advanced, evaluated, and clarified.
          </p>
        </article>

        <article class="dimension-summary">
          <h2 class="dimension-summary-title">Engineering Record</h2>
          <p class="dimension-summary-text">
            What happened, what was decided, what changed, what was verified,
            and what remains unresolved.
          </p>
        </article>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.project01-view {
  width: 100%;
  padding: var(--space-8) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .project01-view {
    padding: var(--space-12) 0;
    gap: var(--space-10, 40px);
  }
}

@media (min-width: 1025px) {
  .project01-view {
    padding: 44px 0 64px 0;
    gap: 40px;
  }
}

/* Header */
.project-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.project-eyebrow {
  font-family: var(--font-family-base);
  font-size: clamp(0.875rem, 1.25vw, 1.125rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  line-height: 1.5;
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
}

.project-title {
  font-family: var(--font-family-base);
  font-size: clamp(2.25rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0;
  outline: none;
}

.header-divider {
  width: 100%;
  height: 1px;
  background-color: var(--color-border-subtle);
  margin-top: var(--space-4);
}

/* Two-Column Composition (Decision 4) */
.project01-columns {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

@media (min-width: 1025px) {
  .project01-columns {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 60px;
  }
}

/* Left Column: ~760px */
.narrative-column {
  flex: 1 1 auto;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.project-definition {
  font-family: var(--font-family-base);
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: 1.25;
  margin: 0;
}

.project-purpose {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.purpose-text {
  font-size: clamp(1rem, 1.25vw, 1.125rem);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  min-width: 310px;
  padding: 0 var(--space-6);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  box-sizing: border-box;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.action-btn--primary {
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-interactive);
}

.action-btn--primary:hover {
  background-color: var(--color-interactive-hover);
}

.action-btn--primary:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 3px;
}

.action-btn--secondary,
.action-btn--accent {
  background-color: var(--color-surface-accent);
  color: var(--color-interactive-primary);
  border: 1px solid var(--color-border-subtle);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.action-btn--secondary:hover,
.action-btn--accent:hover {
  background-color: #d3e5f3;
  color: var(--color-interactive-primary);
  border-color: #d3e5f3;
}

.action-btn--secondary:focus-visible,
.action-btn--accent:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 3px;
}

@media (max-width: 600px) {
  .project-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
  }

  .action-btn {
    width: 100%;
    min-width: 0;
    min-height: 52px;
    height: auto;
    padding: 8px 12px;
    font-size: 0.875rem;
    line-height: 1.25;
    text-align: center;
    white-space: normal;
  }
}

/* Right Column: ~340px */
.dimensions-column {
  flex: 0 0 auto;
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding-top: var(--space-1);
}

.dimension-summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.dimension-summary-title {
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: 1.3;
  margin: 0;
}

.dimension-summary-text {
  font-size: 1rem;
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}
</style>
