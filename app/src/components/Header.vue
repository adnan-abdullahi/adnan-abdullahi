<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import type { ExperienceLocation } from "@/models/experience";

const route = useRoute();

/**
 * Context label displayed alongside professional identity in the header.
 * Reflects current location in canonical 5-state topology (Decision 02 Point 1).
 */
const contextTag = computed<string | null>(() => {
  const loc = (route.meta.location as ExperienceLocation) || "orientation";
  switch (loc) {
    case "orientation":
    case "about":
      return null;
    case "project-01":
    case "engineering-approach":
    case "engineering-record":
    case "deep-engineering":
      return "PROJECT 01";
    default:
      return "PROJECT 01";
  }
});
</script>

<template>
  <div class="desktop-header-container">
    <div class="header-inner">
      <!-- Professional Identity: Centered on Adnan Abdullahi (Decision 2) -->
      <div class="header-identity">
        <RouterLink
          to="/orientation"
          class="identity-link"
          aria-label="Adnan Abdullahi — Portfolio Orientation"
        >
          <span class="identity-name">Adnan Abdullahi</span>
        </RouterLink>
        <span
          v-if="contextTag"
          class="project-tag"
          role="img"
          aria-label="Project 01 context brand"
        >
          {{ contextTag }}
        </span>
      </div>

      <!-- Penpot Approved Header Navigation (Decision A) -->
      <nav aria-label="Main Navigation" class="header-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <RouterLink
              to="/record"
              class="nav-link"
              :class="{ 'nav-link--active': route.path === '/record' }"
            >
              Engineering Record
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              to="/approach"
              class="nav-link"
              :class="{ 'nav-link--active': route.path === '/approach' }"
            >
              Approach
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              to="/about"
              class="nav-link"
              :class="{ 'nav-link--active': route.path === '/about' }"
            >
              About
            </RouterLink>
          </li>
          <li class="nav-item">
            <span class="nav-link nav-link--unresolved" aria-disabled="true">
              Contact
            </span>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.desktop-header-container {
  display: none;
  width: 100%;
  background-color: var(--color-bg-canvas);
  border-bottom: 1px solid var(--color-border-subtle);
  box-sizing: border-box;
}

/* Display only on viewports >= 768px (MobileNav handles < 768px per T013) */
@media (min-width: 768px) {
  .desktop-header-container {
    display: block;
  }
}

.header-inner {
  max-width: var(--container-max-width, 1440px);
  margin: 0 auto;
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  box-sizing: border-box;
}

@media (min-width: 1025px) {
  .header-inner {
    padding: var(--space-4) var(--space-8);
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .header-inner {
    flex-wrap: wrap;
    row-gap: var(--space-2);
  }

  .header-nav {
    order: 3;
    width: 100%;
  }
}

.header-identity {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.identity-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-primary);
  transition: opacity 0.15s ease;
}

.identity-link:hover {
  opacity: 0.85;
}

.identity-link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
}

.identity-name {
  font-family: var(--font-family-base);
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  line-height: var(--line-height-tight);
}

.project-tag {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.05em;
  padding: 2px var(--space-2);
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-interactive);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
}

.header-nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--space-4);
}

@media (min-width: 1025px) {
  .nav-list {
    gap: var(--space-6);
  }
}

.nav-item {
  display: inline-flex;
  align-items: center;
}

.nav-link {
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  padding: var(--space-1) 0;
  border-bottom: 2px solid transparent;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.nav-link:hover:not(.nav-link--unresolved) {
  color: var(--color-interactive-primary);
}

.nav-link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.nav-link--active {
  color: var(--color-interactive-primary);
  font-weight: var(--font-weight-semibold);
  border-bottom-color: var(--color-interactive-primary);
}

.nav-link--unresolved {
  cursor: default;
  user-select: none;
}
</style>
