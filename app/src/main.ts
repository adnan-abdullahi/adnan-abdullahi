import { createApp, h } from 'vue'

// Import foundation design tokens, typography, and responsive layout
import './styles/tokens.css'
import './styles/typography.css'
import './styles/layout.css'

// Foundation placeholder demonstrating Vue 3 mounting readiness
// Note: T011 will implement the full App.vue application shell and T009 will mount the router.
const app = createApp({
  render() {
    return h(
      'main',
      { class: 'container', style: { padding: 'var(--space-8) var(--space-4)' } },
      [
        h('h1', { class: 'type-h1' }, 'Project 01 — Portfolio Experience'),
        h('p', { class: 'type-body', style: { color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' } },
          'Application foundation established (T001–T006). Awaiting Phase 2 authorization.'
        )
      ]
    )
  }
})

app.mount('#app')
