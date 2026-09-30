import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { defineComponent, h, nextTick } from 'vue'
import type { ExperienceLocation, InspectionDepth } from '@/models/experience'

/**
 * Augment vue-router with strongly typed route meta fields.
 */
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    depth: InspectionDepth
    location: ExperienceLocation
    depthLabel: string
  }
}

/**
 * Placeholder component for route views.
 * Will be replaced by full view components in Phase 3–6 (T019, T020, T025, T029, T034).
 */
const createViewPlaceholder = (viewName: string, heading: string) =>
  defineComponent({
    name: viewName,
    render() {
      return h('section', { class: 'view-container', 'data-view': viewName }, [
        h('h1', { class: 'type-h1', tabindex: -1 }, heading)
      ])
    }
  })

/**
 * The 5 canonical route records defining the accepted Project 01 navigation topology.
 * Governed by:
 * - specs/001-project-01-portfolio-experience/spec.md (FR-002)
 * - specs/001-project-01-portfolio-experience/contracts/ui-contracts.md (Section 2)
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/orientation'
  },
  {
    path: '/orientation',
    name: 'orientation',
    component: () => import('@/views/OrientationView.vue'),
    meta: {
      title: 'Portfolio Orientation',
      depth: 'entry',
      location: 'orientation',
      depthLabel: 'Entry Context'
    }
  },
  {
    path: '/project-01',
    name: 'project-01',
    component: () => import('@/views/Project01View.vue'),
    meta: {
      title: 'Project 01 — Portfolio Experience',
      depth: 'project-context',
      location: 'project-01',
      depthLabel: 'Project Context'
    }
  },
  {
    path: '/approach',
    name: 'engineering-approach',
    component: createViewPlaceholder('ApproachView', 'Engineering Approach'),
    meta: {
      title: 'Engineering Approach',
      depth: 'dimension',
      location: 'engineering-approach',
      depthLabel: 'Dimension'
    }
  },
  {
    path: '/record',
    name: 'engineering-record',
    component: createViewPlaceholder('RecordView', 'Engineering Record'),
    meta: {
      title: 'Engineering Record',
      depth: 'dimension',
      location: 'engineering-record',
      depthLabel: 'Dimension'
    }
  },
  {
    path: '/deep-engineering',
    name: 'deep-engineering',
    component: createViewPlaceholder('DeepEngineeringView', 'Deep Engineering'),
    meta: {
      title: 'Deep Engineering — Design Foundations',
      depth: 'deeper-inspection',
      location: 'deep-engineering',
      depthLabel: 'Deeper Inspection'
    }
  },
  {
    // Catch-all: unrecognized paths redirect to orientation per ui-contracts.md
    path: '/:pathMatch(.*)*',
    redirect: '/orientation'
  }
]

/**
 * Vue Router instance utilizing hash history for zero-server-rewrite static compatibility.
 */
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 }
  }
})

/**
 * T010: Route navigation guard and programmatic focus management.
 * Governed by contracts/ui-contracts.md Section 4:
 * 1. The #main-content heading <h1> receives focus via .focus().
 * 2. The aria-live="polite" region announces: "Navigated to [View Title]. Inspection depth: [Depth Name]".
 * 3. Screen position smoothly resets to top (window.scrollTo({ top: 0, behavior: 'auto' })).
 */
router.afterEach((to) => {
  // 1. Synchronize Document Title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Adnan Abdullahi`
  }

  // 2. Programmatic Focus & Screen Reader Announcement on next DOM tick
  nextTick(() => {
    // Reset scroll position
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    // Announce state transition to aria-live="polite" region
    const announcer = typeof document !== 'undefined'
      ? (document.getElementById('a11y-announcer') || document.querySelector('[aria-live="polite"]'))
      : null

    if (announcer && to.meta.title && to.meta.depthLabel) {
      announcer.textContent = `Navigated to ${to.meta.title}. Inspection depth: ${to.meta.depthLabel}`
    }

    // Programmatic focus shift to #main-content heading <h1> or #main-content container
    if (typeof document !== 'undefined') {
      const heading = document.querySelector<HTMLElement>('#main-content h1')
      if (heading) {
        if (!heading.hasAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1')
        }
        heading.focus()
      } else {
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.focus()
        }
      }
    }
  })
})

export default router
