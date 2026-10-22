<script setup lang="ts">
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="desktop-header-container">
    <div class="header-inner">
      <!-- Professional Identity: Semantic RouterLink to /orientation -->
      <div class="header-identity">
        <RouterLink
          to="/orientation"
          class="identity-link"
          aria-label="Adnan Abdullahi — Portfolio Orientation"
        >
          <span class="identity-name">Adnan Abdullahi</span>
        </RouterLink>
      </div>

      <!-- Penpot Approved Header Navigation (5 Canonical Destinations per Requirement A & B) -->
      <nav aria-label="Main Navigation" class="header-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <RouterLink
              to="/orientation"
              class="nav-link"
              :class="{ 'nav-link--active': route.path === '/orientation' || route.path === '/' }"
              :aria-current="(route.path === '/orientation' || route.path === '/') ? 'page' : undefined"
            >
              Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              to="/record"
              class="nav-link"
              :class="{ 'nav-link--active': route.path === '/record' }"
              :aria-current="route.path === '/record' ? 'page' : undefined"
            >
              Engineering Record
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              to="/approach"
              class="nav-link"
              :class="{ 'nav-link--active': route.path === '/approach' }"
              :aria-current="route.path === '/approach' ? 'page' : undefined"
            >
              Approach
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              to="/about"
              class="nav-link"
              :class="{ 'nav-link--active': route.path === '/about' }"
              :aria-current="route.path === '/about' ? 'page' : undefined"
            >
              About
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              to="/contact"
              class="nav-link"
              :class="{ 'nav-link--active': route.path === '/contact' }"
              :aria-current="route.path === '/contact' ? 'page' : undefined"
            >
              Contact
            </RouterLink>
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
  padding: var(--space-4) var(--container-padding-x-tablet, var(--space-6));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  box-sizing: border-box;
}

@media (min-width: 1025px) {
  .header-inner {
    padding: var(--space-4) var(--container-padding-x-desktop, 80px);
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
  flex-shrink: 0;
}

.identity-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  transition: color 0.15s ease;
}

.identity-link:hover {
  color: var(--color-interactive-primary);
}

.identity-link:hover .identity-name {
  color: var(--color-interactive-primary);
}

.identity-link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 4px;
}

.identity-name {
  font-family: var(--font-family-base);
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  line-height: var(--line-height-tight);
  transition: color 0.15s ease;
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

.nav-link:hover {
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
</style>
