<script setup lang="ts">
import { RouterLink } from "vue-router";
import aboutContent from "@/content/about";

const content = aboutContent;
</script>

<template>
  <div class="about-view">
    <!-- Page Header Landmark & Title -->
    <header class="about-header">
      <h1 id="main-heading" class="page-title" tabindex="-1">
        {{ content.pageTitle }}
      </h1>
    </header>

    <!-- Reading Container: 720px max-width, left-aligned, single-column -->
    <div class="reading-container">
      <!-- Section 1: About Me -->
      <section class="about-section" aria-labelledby="about-me-heading">
        <h2 id="about-me-heading" class="section-heading">
          {{ content.aboutMe.heading }}
        </h2>
        <div class="identity-block">
          <div class="identity-name">{{ content.aboutMe.name }}</div>
          <div class="identity-role">{{ content.aboutMe.role }}</div>
        </div>
        <p
          v-for="(para, idx) in content.aboutMe.paragraphs"
          :key="idx"
          class="body-paragraph"
        >
          {{ para }}
        </p>
      </section>

      <!-- Section 2: How I Work -->
      <section class="about-section" aria-labelledby="how-i-work-heading">
        <h2 id="how-i-work-heading" class="section-heading">
          {{ content.howIWork.heading }}
        </h2>
        <p
          v-for="(para, idx) in content.howIWork.paragraphs"
          :key="idx"
          class="body-paragraph"
        >
          {{ para }}
        </p>
        <p class="closing-principle">
          {{ content.howIWork.closingPrinciple }}
        </p>
      </section>

      <!-- Section 3: What I Work On -->
      <section class="about-section" aria-labelledby="what-i-work-on-heading">
        <h2 id="what-i-work-on-heading" class="section-heading">
          {{ content.whatIWorkOn.heading }}
        </h2>
        <p
          v-for="(para, idx) in content.whatIWorkOn.paragraphs"
          :key="idx"
          class="body-paragraph"
        >
          {{ para }}
        </p>
      </section>

      <!-- Section 4: Where I'm Going -->
      <section class="about-section" aria-labelledby="where-im-going-heading">
        <h2 id="where-im-going-heading" class="section-heading">
          {{ content.whereImGoing.heading }}
        </h2>
        <p
          v-for="(para, idx) in content.whereImGoing.paragraphs"
          :key="idx"
          class="body-paragraph"
        >
          {{ para }}
        </p>
      </section>

      <!-- Section 5: Let's Connect -->
      <section
        class="about-section about-section--final"
        aria-labelledby="lets-connect-heading"
      >
        <h2 id="lets-connect-heading" class="section-heading">
          {{ content.letsConnect.heading }}
        </h2>
        <p
          v-for="(para, idx) in content.letsConnect.paragraphs"
          :key="idx"
          class="body-paragraph"
        >
          {{ para }}
        </p>
        <div class="cta-row">
          <RouterLink
            :to="content.letsConnect.cta.to"
            class="btn-cta"
            :aria-label="content.letsConnect.cta.ariaLabel"
          >
            <span>{{ content.letsConnect.cta.label }}</span>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Page Layout */
.about-view {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4) 64px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .about-view {
    padding: var(--space-10, 40px) var(--space-8) 80px;
  }
}

@media (min-width: 1025px) {
  .about-view {
    padding: 42px 80px 101px;
  }
}

/* Page Header & Title */
.about-header {
  margin-bottom: var(--space-12, 48px);
}

.page-title {
  color: var(--color-text-primary);
  margin: 0;
  font-family: var(--font-family-base);
  font-size: clamp(2.25rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
  letter-spacing: -0.02em;
  outline: none;
}

/* Single-Column Editorial Reading Width */
.reading-container {
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Section Spacing: Pure whitespace (96px on desktop) */
.about-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 56px;
}

@media (min-width: 768px) {
  .about-section {
    margin-bottom: 72px;
  }
}

@media (min-width: 1025px) {
  .about-section {
    margin-bottom: 96px;
  }
}

.about-section--final {
  margin-bottom: 0;
}

/* Section Heading (24px SemiBold) */
.section-heading {
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
  margin: 0 0 var(--space-4, 16px);
}

/* Section 1 Identity Block */
.identity-block {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-6, 24px);
}

.identity-name {
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  margin-bottom: var(--space-2, 8px);
}

.identity-role {
  color: var(--color-text-secondary);
  font-family: var(--font-family-base);
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
}

/* Editorial Body Text (18px Regular) */
.body-paragraph {
  color: var(--color-text-secondary);
  font-family: var(--font-family-base);
  font-size: 1.125rem;
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  margin: 0 0 var(--space-4, 16px);
}

.body-paragraph:last-of-type {
  margin-bottom: 0;
}

/* Closing Principle (18px SemiBold) */
.closing-principle {
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: 1.125rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  margin: var(--space-4, 16px) 0 0;
}

/* Section 5 CTA Row & Button */
.cta-row {
  margin-top: var(--space-6, 24px);
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  min-width: 200px;
  padding: 0 var(--space-6);
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-interactive);
  border-radius: 6px;
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  text-decoration: none;
  box-sizing: border-box;
  transition: background-color 0.15s ease;
  cursor: pointer;
}

.btn-cta:hover {
  background-color: var(--color-interactive-hover);
}

.btn-cta:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 3px;
}
</style>
