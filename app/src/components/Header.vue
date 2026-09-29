<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import type { ExperienceLocation } from '@/models/experience'
import DepthIndicator from './DepthIndicator.vue'

const route = useRoute()

interface BreadcrumbItem {
  label: string
  to?: string
  isCurrent: boolean
}

/**
 * Compute active breadcrumb chain based on canonical navigation topology.
 * Governed by specs/001-project-01-portfolio-experience/data-model.md Section 4
 */
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const loc = (route.meta.location as ExperienceLocation) || 'orientation'

  switch (loc) {
    case 'orientation':
      return [{ label: 'Portfolio Orientation', isCurrent: true }]
    case 'project-01':
      return [
        { label: 'Orientation', to: '/orientation', isCurrent: false },
        { label: 'Project 01', isCurrent: true }
      ]
    case 'engineering-approach':
      return [
        { label: 'Project 01', to: '/project-01', isCurrent: false },
        { label: 'Engineering Approach', isCurrent: true }
      ]
    case 'engineering-record':
      return [
        { label: 'Project 01', to: '/project-01', isCurrent: false },
        { label: 'Engineering Record', isCurrent: true }
      ]
    case 'deep-engineering':
      return [
        { label: 'Project 01', to: '/project-01', isCurrent: false },
        { label: 'Deep Engineering', isCurrent: true }
      ]
    default:
      return [{ label: 'Project 01', to: '/project-01', isCurrent: true }]
  }
})
</script>

<template>
  <div class="desktop-header-container">
    <div class="header-inner">
      <!-- Project Context Brand -->
      <div class="header-context">
        <RouterLink to="/project-01" class="header-title-link">
          <span class="project-tag">PROJECT 01</span>
          <span class="header-title">Portfolio Experience</span>
        </RouterLink>
      </div>

      <!-- Reactive Breadcrumbs -->
      <nav aria-label="Breadcrumb Navigation" class="header-breadcrumbs">
        <ol class="breadcrumb-list">
          <li
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            class="breadcrumb-item"
          >
            <span v-if="index > 0" class="breadcrumb-separator" aria-hidden="true">/</span>
            <RouterLink
              v-if="crumb.to && !crumb.isCurrent"
              :to="crumb.to"
              class="breadcrumb-link"
            >
              {{ crumb.label }}
            </RouterLink>
            <span
              v-else
              class="breadcrumb-current"
              aria-current="page"
            >
              {{ crumb.label }}
            </span>
          </li>
        </ol>
      </nav>

      <!-- Inspection Depth Badge -->
      <div class="header-depth">
        <DepthIndicator />
      </div>
    </div>
  </div>
</template>

<style scoped>
.desktop-header-container {
  display: none;
  width: 100%;
  background-color: var(--color-bg-surface);
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

.header-context {
  display: flex;
  align-items: center;
}

.header-title-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  transition: opacity 0.15s ease;
}

.header-title-link:hover {
  opacity: 0.85;
}

.header-title-link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
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

.header-title {
  font-size: var(--font-size-sm);
  letter-spacing: -0.01em;
}

.header-breadcrumbs {
  flex: 1;
  display: flex;
  justify-content: center;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--font-size-sm);
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-separator {
  margin: 0 var(--space-2);
  color: var(--color-text-tertiary);
}

.breadcrumb-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.breadcrumb-link:hover {
  color: var(--color-interactive-primary);
  text-decoration: underline;
}

.breadcrumb-link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.breadcrumb-current {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.header-depth {
  display: flex;
  align-items: center;
}
</style>

