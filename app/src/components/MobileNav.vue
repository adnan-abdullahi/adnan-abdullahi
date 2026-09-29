<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import type { ExperienceLocation } from '@/models/experience'
import DepthIndicator from './DepthIndicator.vue'

const route = useRoute()

interface ReturnTarget {
  label: string
  to: string
  ariaLabel: string
}

/**
 * Computes the deterministic contextual return target based on active route.
 * Governed by specs/001-project-01-portfolio-experience/data-model.md Section 4
 */
const returnTarget = computed<ReturnTarget | null>(() => {
  const loc = (route.meta.location as ExperienceLocation) || 'orientation'

  switch (loc) {
    case 'orientation':
      // Entry context; no parent return path
      return null
    case 'project-01':
      return {
        label: 'Orientation',
        to: '/orientation',
        ariaLabel: 'Return to Portfolio Orientation'
      }
    case 'engineering-approach':
    case 'engineering-record':
    case 'deep-engineering':
      return {
        label: 'Project 01',
        to: '/project-01',
        ariaLabel: 'Return to Project 01'
      }
    default:
      return {
        label: 'Project 01',
        to: '/project-01',
        ariaLabel: 'Return to Project 01'
      }
  }
})

const currentLocationTitle = computed(() => {
  const loc = (route.meta.location as ExperienceLocation) || 'orientation'
  switch (loc) {
    case 'orientation':
      return 'Orientation'
    case 'project-01':
      return 'Project 01'
    case 'engineering-approach':
      return 'Approach'
    case 'engineering-record':
      return 'Record'
    case 'deep-engineering':
      return 'Deep Engineering'
    default:
      return 'Project 01'
  }
})
</script>

<template>
  <nav aria-label="Mobile Navigation" class="mobile-nav-container">
    <div class="mobile-nav-inner">
      <!-- Return Action Button (if not on orientation entry) -->
      <div class="mobile-return-area">
        <RouterLink
          v-if="returnTarget"
          :to="returnTarget.to"
          class="mobile-return-btn"
          :aria-label="returnTarget.ariaLabel"
        >
          <svg
            class="return-icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M10 12l-4-4 4-4" />
          </svg>
          <span class="return-text">{{ returnTarget.label }}</span>
        </RouterLink>

        <!-- Brand mark when on entry orientation -->
        <span v-else class="mobile-brand-mark">
          PROJECT 01
        </span>
      </div>

      <!-- Current Location & Depth Indicator -->
      <div class="mobile-status-area">
        <span class="mobile-location-label">{{ currentLocationTitle }}</span>
        <DepthIndicator compact />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.mobile-nav-container {
  display: block;
  position: sticky;
  top: 0;
  z-index: 90;
  width: 100%;
  background-color: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border-subtle);
  box-sizing: border-box;
}

/* Hide on desktop viewports (Header.vue active >= 768px) */
@media (min-width: 768px) {
  .mobile-nav-container {
    display: none;
  }
}

.mobile-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  gap: var(--space-3);
  min-height: 48px;
  box-sizing: border-box;
}

.mobile-return-area {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.mobile-return-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  min-height: 36px;
  background-color: var(--color-bg-canvas);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  color: var(--color-interactive-primary);
  text-decoration: none;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.mobile-return-btn:hover {
  border-color: var(--color-interactive-primary);
}

.mobile-return-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.return-icon {
  width: 14px;
  height: 14px;
}

.return-text {
  letter-spacing: -0.01em;
}

.mobile-brand-mark {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.05em;
  padding: 2px var(--space-2);
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-interactive);
  border-radius: var(--radius-sm);
}

.mobile-status-area {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  overflow: hidden;
}

.mobile-location-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
