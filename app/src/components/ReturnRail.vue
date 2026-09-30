<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import type { ExperienceLocation } from '@/models/experience'

const props = defineProps<{
  targetLocation?: ExperienceLocation
}>()

const route = useRoute()

interface ReturnConfig {
  to: string
  label: string
  sublabel: string
  ariaLabel: string
}

/**
 * Computes the deterministic lateral return destination.
 * Governed by:
 * - specs/001-project-01-portfolio-experience/data-model.md Section 4
 * - specs/001-project-01-portfolio-experience/contracts/ui-contracts.md Section 3
 */
const returnConfig = computed<ReturnConfig | null>(() => {
  const loc = props.targetLocation || (route.meta?.location as ExperienceLocation) || 'orientation'

  switch (loc) {
    case 'orientation':
      // Root entry level has no return path
      return null

    case 'project-01':
      return {
        to: '/orientation',
        label: 'Return to Portfolio Orientation',
        sublabel: 'Back to entry context & role overview',
        ariaLabel: 'Return to Portfolio Orientation'
      }

    case 'engineering-approach':
      return {
        to: '/project-01',
        label: 'Return to Project 01',
        sublabel: 'Back to central portfolio project context',
        ariaLabel: 'Return to Project 01'
      }

    case 'engineering-record':
      return {
        to: '/project-01',
        label: 'Return to Project 01',
        sublabel: 'Back to central portfolio project context',
        ariaLabel: 'Return to Project 01'
      }

    case 'deep-engineering':
      return {
        to: '/project-01',
        label: 'Return to Project 01',
        sublabel: 'Contextual return from deeper inspection to central project',
        ariaLabel: 'Return to Project 01'
      }

    default:
      return {
        to: '/project-01',
        label: 'Return to Project 01',
        sublabel: 'Back to central portfolio project context',
        ariaLabel: 'Return to Project 01'
      }
  }
})
</script>

<template>
  <div v-if="returnConfig" class="return-rail-container">
    <div class="return-rail-inner">
      <RouterLink
        :to="returnConfig.to"
        class="return-rail-link"
        :aria-label="returnConfig.ariaLabel"
      >
        <span class="return-rail-icon-wrapper" aria-hidden="true">
          <svg
            class="return-rail-icon"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 10H5" />
            <path d="M10 15l-5-5 5-5" />
          </svg>
        </span>
        <div class="return-rail-text">
          <span class="return-rail-label">{{ returnConfig.label }}</span>
          <span class="return-rail-sublabel">{{ returnConfig.sublabel }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.return-rail-container {
  width: 100%;
  border-top: 1px solid var(--color-border-subtle);
  background-color: var(--color-bg-surface);
  margin-top: var(--space-8);
  box-sizing: border-box;
}

.return-rail-inner {
  max-width: var(--container-max-width, 1440px);
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .return-rail-inner {
    padding: var(--space-6);
  }
}

@media (min-width: 1025px) {
  .return-rail-inner {
    padding: var(--space-8);
  }
}

.return-rail-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-bg-canvas);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-primary);
  transition: border-color 0.2s ease, transform 0.15s ease, background-color 0.2s ease;
  min-height: 48px;
  box-sizing: border-box;
}

.return-rail-link:hover {
  border-color: var(--color-interactive-primary);
  background-color: rgba(74, 144, 217, 0.04);
  transform: translateX(-2px);
}

/* High-contrast accessible focus ring (WCAG 2.4.7) */
.return-rail-link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 4px;
  border-color: var(--color-interactive-primary);
}

.return-rail-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  color: var(--color-interactive-primary);
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}

.return-rail-link:hover .return-rail-icon-wrapper {
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-interactive);
}

.return-rail-icon {
  width: 16px;
  height: 16px;
}

.return-rail-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.return-rail-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-interactive-primary);
  letter-spacing: -0.01em;
}

.return-rail-sublabel {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}
</style>
