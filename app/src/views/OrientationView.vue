<script setup lang="ts">
import { RouterLink } from 'vue-router'
import orientationContent from '@/content/orientation'

const content = orientationContent
</script>

<template>
  <div class="orientation-view">
    <!-- Hero / Identity Section (Open, Left-Aligned per Decision 3) -->
    <header class="orientation-hero">
      <h1 id="main-heading" class="hero-name" tabindex="-1">
        {{ content.identity.name }}
      </h1>
      <p class="hero-role">
        {{ content.identity.role }}
      </p>
    </header>

    <!-- Engineering Proposition Section -->
    <section class="proposition-section" aria-labelledby="proposition-heading">
      <h2 id="proposition-heading" class="sr-only">
        {{ content.proposition.heading }}
      </h2>
      <p class="proposition-statement">
        {{ content.proposition.statement }}
      </p>
      <p class="record-statement">
        {{ content.proposition.recordStatement }}
      </p>
    </section>

    <!-- Action Area (Open layout, No cards/badges per Decision 3 & 5) -->
    <section class="actions-section" aria-label="Portfolio Exploration Actions">
      <div class="actions-row">
        <RouterLink
          :to="content.actions.primary.to"
          class="btn-primary"
          :aria-label="content.actions.primary.ariaLabel"
        >
          <span>{{ content.actions.primary.label }}</span>
        </RouterLink>

        <RouterLink
          :to="content.actions.secondary.to"
          class="btn-secondary"
          :aria-label="content.actions.secondary.ariaLabel"
        >
          <span>{{ content.actions.secondary.label }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- Evidence Section (Open editorial typography, No dashed boxes per Decision 3) -->
    <section class="evidence-section" aria-labelledby="evidence-heading">
      <h2 id="evidence-heading" class="evidence-heading">
        {{ content.evidencePreview.heading }}
      </h2>
      <p class="evidence-description">
        {{ content.evidencePreview.description }}
      </p>
    </section>
  </div>
</template>

<style scoped>
.orientation-view {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .orientation-view {
    padding: var(--space-12) var(--space-8);
    gap: var(--space-10, 40px);
  }
}

@media (min-width: 1025px) {
  .orientation-view {
    padding: 48px 80px;
    gap: 44px;
  }
}

/* Hero Section */
.orientation-hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.hero-name {
  color: var(--color-text-primary);
  margin: 0;
  font-size: clamp(2.25rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
  letter-spacing: -0.02em;
  outline: none;
}

.hero-role {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
}

/* Proposition Section */
.proposition-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 720px;
}

.proposition-statement {
  font-size: clamp(1.125rem, 1.5vw, 1.25rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: 1.5;
  margin: 0;
}

.record-statement {
  font-size: clamp(1rem, 1.25vw, 1.125rem);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* Actions Area */
.actions-section {
  margin-top: var(--space-2);
}

.actions-row {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  min-width: 292px;
  padding: 0 var(--space-6);
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-interactive);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  box-sizing: border-box;
  transition: background-color 0.15s ease;
}

.btn-primary:hover {
  background-color: var(--color-interactive-hover);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 3px;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  padding: var(--space-2) 0;
  transition: color 0.15s ease;
}

.btn-secondary:hover {
  color: var(--color-text-primary);
}

.btn-secondary:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Evidence Section */
.evidence-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-4);
  max-width: 720px;
}

.evidence-heading {
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: 1.2;
  margin: 0;
}

.evidence-description {
  font-size: clamp(1rem, 1.25vw, 1.125rem);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>

