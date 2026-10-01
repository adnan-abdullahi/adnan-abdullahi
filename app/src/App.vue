<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import MobileNav from './components/MobileNav.vue'
</script>

<template>
  <div class="app-layout">
    <!-- Accessible Skip Link for Keyboard Navigation (WCAG 2.4.1) -->
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>

    <!-- Accessibility Live Region for Route Announcements (WCAG 4.1.2) -->
    <div
      id="a11y-announcer"
      class="sr-only"
      aria-live="polite"
      aria-atomic="true"
    ></div>

    <!-- Application Banner Landmark (Desktop Header + Sticky Mobile Nav) -->
    <header role="banner" class="app-header-landmark">
      <Header />
      <MobileNav />
    </header>

    <!-- Main Content Landmark -->
    <main
      id="main-content"
      role="main"
      tabindex="-1"
      class="main-content-landmark"
    >
      <div class="main-viewport-container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-canvas);
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  line-height: var(--line-height-normal);
}

/* Skip link: hidden off-screen until focused */
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-interactive);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  text-decoration: none;
  z-index: 1000;
  transition: top 0.15s ease-out;
}

.skip-link:focus {
  top: var(--space-4);
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.app-header-landmark {
  width: 100%;
  position: relative;
  z-index: 100;
}

.main-content-landmark {
  flex: 1 0 auto;
  width: 100%;
  outline: none;
}

.main-viewport-container {
  width: 100%;
  max-width: var(--container-max-width, 1440px);
  margin: 0 auto;
  padding: 0 var(--space-4);
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .main-viewport-container {
    padding: 0 var(--space-6);
  }
}

@media (min-width: 1025px) {
  .main-viewport-container {
    padding: 0 var(--space-8);
  }
}
</style>
