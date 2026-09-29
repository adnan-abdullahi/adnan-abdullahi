<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { InspectionDepth } from '@/models/experience'

const props = defineProps<{
  depth?: InspectionDepth
  label?: string
  compact?: boolean
}>()

const route = useRoute()

const activeDepth = computed<InspectionDepth>(() => {
  if (props.depth) return props.depth
  return (route.meta?.depth as InspectionDepth) || 'entry'
})

const activeLabel = computed<string>(() => {
  if (props.label) return props.label
  if (route.meta?.depthLabel) return route.meta.depthLabel as string

  switch (activeDepth.value) {
    case 'entry':
      return 'Entry Context'
    case 'project-context':
      return 'Project Context'
    case 'dimension':
      return 'Dimension'
    case 'deeper-inspection':
      return 'Deeper Inspection'
    default:
      return 'Context'
  }
})

const badgeClass = computed(() => {
  return [
    `depth-badge--${activeDepth.value}`,
    { 'depth-badge--compact': props.compact }
  ]
})
</script>

<template>
  <span
    class="depth-badge"
    :class="badgeClass"
    role="status"
    :aria-label="`Inspection depth: ${activeLabel}`"
  >
    <span class="depth-dot" aria-hidden="true"></span>
    <span class="depth-text">{{ activeLabel }}</span>
  </span>
</template>

<style scoped>
.depth-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-canvas);
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
  box-sizing: border-box;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.depth-badge--compact {
  padding: 1px var(--space-2);
  font-size: 10px;
  gap: var(--space-1);
}

.depth-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-text-tertiary);
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}

.depth-badge--compact .depth-dot {
  width: 5px;
  height: 5px;
}

/* Entry Context: Accent Teal */
.depth-badge--entry {
  border-color: rgba(108, 142, 191, 0.4);
}
.depth-badge--entry .depth-dot {
  background-color: var(--color-accent-teal);
}
.depth-badge--entry .depth-text {
  color: var(--color-accent-teal);
}

/* Project Context: Interactive Primary Blue */
.depth-badge--project-context {
  border-color: rgba(74, 144, 217, 0.4);
}
.depth-badge--project-context .depth-dot {
  background-color: var(--color-interactive-primary);
}
.depth-badge--project-context .depth-text {
  color: var(--color-interactive-primary);
}

/* Dimension: Purple */
.depth-badge--dimension {
  border-color: rgba(139, 111, 212, 0.4);
}
.depth-badge--dimension .depth-dot {
  background-color: var(--color-purple-deeper);
}
.depth-badge--dimension .depth-text {
  color: var(--color-purple-deeper);
}

/* Deeper Inspection: Purple */
.depth-badge--deeper-inspection {
  border-color: rgba(139, 111, 212, 0.6);
  background-color: rgba(139, 111, 212, 0.08);
}
.depth-badge--deeper-inspection .depth-dot {
  background-color: var(--color-purple-deeper);
}
.depth-badge--deeper-inspection .depth-text {
  color: var(--color-purple-deeper);
  font-weight: var(--font-weight-semibold);
}
</style>
