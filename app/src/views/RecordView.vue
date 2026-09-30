<script setup lang="ts">
import { RouterLink } from "vue-router";
import recordContent from "@/content/record";

const content = recordContent;
</script>

<template>
  <div class="record-view">
    <!-- Header Landmark (Penpot Eyebrow + Screen Title) -->
    <header class="record-header">
      <p class="record-eyebrow">
        {{ content.eyebrow }}
      </p>
      <h1 id="main-heading" class="record-title" tabindex="-1">
        {{ content.title }}
      </h1>
    </header>

    <!-- Narrative & Chronological Decision Section -->
    <section
      class="record-content"
      aria-label="Engineering Record Narrative and Chronological Entries"
    >
      <!-- Record Intro Statement -->
      <p class="record-intro">
        {{ content.intro }}
      </p>

      <!-- 3-Column Chronological Decisions Grid (Penpot Columns 1-3) -->
      <div
        class="record-columns-grid"
        role="region"
        aria-label="Chronological Decision Records"
      >
        <article
          v-for="entry in content.chronologicalEntries"
          :key="entry.id"
          class="record-column-card"
          :data-record-id="entry.id"
        >
          <div class="record-column-header">
            <h2 class="record-column-title">
              {{ entry.title }}
            </h2>
          </div>
          <p class="record-column-body">
            {{ entry.body }}
          </p>
        </article>
      </div>

      <!-- Concluding Note / Visible Uncertainty Reflection -->
      <p class="record-concluding-note">
        {{ content.concludingNote }}
      </p>

      <!-- Action Navigation Gateway (Penpot 2-Button Gateway) -->
      <div class="record-actions" aria-label="Record Navigation Actions">
        <RouterLink
          :to="content.actions.primary.to"
          class="action-btn action-btn--primary"
          :aria-label="content.actions.primary.ariaLabel"
        >
          <span>{{ content.actions.primary.label }}</span>
        </RouterLink>

        <RouterLink
          :to="content.actions.secondary.to"
          class="action-btn action-btn--accent"
          :aria-label="content.actions.secondary.ariaLabel"
        >
          <span>{{ content.actions.secondary.label }}</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.record-view {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .record-view {
    padding: var(--space-12) var(--space-8);
    gap: var(--space-10, 40px);
  }
}

@media (min-width: 1025px) {
  .record-view {
    padding: 44px 80px 64px 80px;
    gap: 40px;
  }
}

/* Header Landmark */
.record-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.record-eyebrow {
  font-family: var(--font-family-base);
  font-size: clamp(0.875rem, 1.25vw, 1.125rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
}

.record-title {
  font-family: var(--font-family-base);
  font-size: clamp(2.25rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin: 0;
  outline: none;
}

/* Content Container */
.record-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.record-intro {
  font-family: var(--font-family-base);
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  color: var(--color-text-primary);
  max-width: 1100px;
  margin: 0;
}

/* 3-Column Chronological Decisions Grid */
.record-columns-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  margin-top: var(--space-2);
}

@media (min-width: 768px) {
  .record-columns-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-8);
  }
}

@media (min-width: 1025px) {
  .record-columns-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 60px;
    max-width: 1280px;
  }
}

.record-column-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.record-column-header {
  display: flex;
  align-items: center;
}

.record-column-title {
  font-family: var(--font-family-base);
  font-size: 1.125rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  color: var(--color-interactive-primary);
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
}

.record-column-body {
  font-family: var(--font-family-base);
  font-size: var(--type-body-size);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0;
}

/* Concluding Note */
.record-concluding-note {
  font-family: var(--font-family-base);
  font-size: var(--type-body-size);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  color: var(--color-text-secondary);
  max-width: 1100px;
  margin: var(--space-2) 0 0 0;
}

/* Actions Gateway */
.record-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 var(--space-6);
  font-family: var(--font-family-base);
  font-size: var(--type-body-size);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
  cursor: pointer;
}

.action-btn:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

.action-btn--primary {
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-interactive);
  min-width: 280px;
}

.action-btn--primary:hover {
  background-color: var(--color-interactive-hover);
}

.action-btn--accent {
  background-color: var(--color-surface-accent);
  color: var(--color-interactive-primary);
  border-color: var(--color-surface-accent);
  min-width: 220px;
}

.action-btn--accent:hover {
  background-color: #d2e4f2;
}

@media (max-width: 600px) {
  .record-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    min-width: auto;
  }
}
</style>
