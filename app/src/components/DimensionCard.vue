<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  title: string
  summary: string
  to?: string
  actionLabel?: string
  ariaLabel?: string
}>()

const computedAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  if (props.actionLabel) return `${props.actionLabel} — ${props.title}`
  return `Inspect ${props.title}`
})
</script>

<template>
  <article class="dimension-card">
    <div class="dimension-card-header">
      <h3 class="dimension-card-title">
        {{ title }}
      </h3>
    </div>
    <div class="dimension-card-body">
      <p class="dimension-card-summary">
        {{ summary }}
      </p>
    </div>
    <div v-if="to" class="dimension-card-footer">
      <RouterLink
        :to="to"
        class="dimension-card-link"
        :aria-label="computedAriaLabel"
      >
        <span>{{ actionLabel || 'Inspect Dimension' }}</span>
        <span class="dimension-card-arrow" aria-hidden="true">&rarr;</span>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.dimension-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-6);
  background-color: var(--color-bg-canvas);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.dimension-card:hover {
  border-color: var(--color-interactive-primary);
}

.dimension-card-header {
  margin-bottom: var(--space-2);
}

.dimension-card-title {
  font-family: var(--font-family-base);
  font-size: var(--type-h3-size);
  font-weight: var(--font-weight-semibold);
  line-height: var(--type-h3-line-height);
  color: var(--color-text-primary);
  margin: 0;
}

.dimension-card-body {
  flex: 1;
}

.dimension-card-summary {
  font-family: var(--font-family-base);
  font-size: var(--type-body-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--type-body-line-height);
  color: var(--color-text-secondary);
  margin: 0;
}

.dimension-card-footer {
  margin-top: var(--space-4);
}

.dimension-card-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family-base);
  font-size: var(--type-body-small-size);
  font-weight: var(--font-weight-semibold);
  color: var(--color-interactive-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.dimension-card-link:hover {
  color: var(--color-interactive-hover);
  text-decoration: underline;
}

.dimension-card-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

.dimension-card-arrow {
  display: inline-block;
  transition: transform var(--transition-fast);
}

.dimension-card-link:hover .dimension-card-arrow {
  transform: translateX(2px);
}
</style>

