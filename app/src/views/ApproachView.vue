<script setup lang="ts">
import { RouterLink } from "vue-router";
import approachContent from "@/content/approach";

const content = approachContent;
</script>

<template>
  <div class="approach-view">
    <!-- Header Landmark (Penpot Eyebrow + Screen Title) -->
    <header class="approach-header">
      <p class="approach-eyebrow">
        {{ content.eyebrow }}
      </p>
      <h1 id="main-heading" class="approach-title" tabindex="-1">
        {{ content.title }}
      </h1>
    </header>

    <!-- Narrative & Methodology Section -->
    <section
      class="approach-content"
      aria-label="Engineering Approach Narrative"
    >
      <!-- Intro Statement -->
      <p class="approach-intro">
        {{ content.intro }}
      </p>

      <!-- Governing Engineering Principle / Philosophy Block -->
      <div
        class="approach-principle-block"
        aria-label="Governing Engineering Principle"
      >
        <h2 class="approach-principle-quote">
          {{ content.governingPhilosophy }}
        </h2>
      </div>

      <!-- Technology Principle Statement -->
      <p class="approach-technology-principle">
        {{ content.technologyPrinciple }}
      </p>

      <!-- Action Navigation Gateway (Penpot 2-Button Gateway) -->
      <div class="approach-actions" aria-label="Approach Navigation Actions">
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
.approach-view {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .approach-view {
    padding: var(--space-12) var(--space-8);
    gap: var(--space-10, 40px);
  }
}

@media (min-width: 1025px) {
  .approach-view {
    padding: 44px 80px 64px 80px;
    gap: 40px;
  }
}

/* Header Landmark */
.approach-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.approach-eyebrow {
  font-family: var(--font-family-base);
  font-size: clamp(0.875rem, 1.25vw, 1.125rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
}

.approach-title {
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
.approach-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .approach-content {
    gap: var(--space-8);
  }
}

.approach-intro {
  font-family: var(--font-family-base);
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.35;
  color: var(--color-text-primary);
  max-width: 860px;
  margin: 0;
}

.approach-principle-block {
  max-width: 980px;
  margin: 0;
}

.approach-principle-quote {
  font-family: var(--font-family-base);
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  color: var(--color-text-primary);
  margin: 0;
}

.approach-technology-principle {
  font-family: var(--font-family-base);
  font-size: 1.125rem;
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
  color: var(--color-text-secondary);
  max-width: 860px;
  margin: 0;
}

/* Actions Gateway */
.approach-actions {
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
  .approach-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    min-width: auto;
  }
}
</style>
