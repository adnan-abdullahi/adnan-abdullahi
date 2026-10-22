<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();

const isDrawerOpen = ref(false);
const hamburgerBtnRef = ref<HTMLButtonElement | null>(null);
const closeBtnRef = ref<HTMLButtonElement | null>(null);

const DESKTOP_BREAKPOINT = 768;
let mediaQueryList: MediaQueryList | null = null;

interface NavItem {
  label: string;
  to: string;
  routePath: string;
}

const navItems: NavItem[] = [
  { label: "Home", to: "/orientation", routePath: "/orientation" },
  { label: "Engineering Record", to: "/record", routePath: "/record" },
  { label: "Approach", to: "/approach", routePath: "/approach" },
  { label: "About", to: "/about", routePath: "/about" },
  { label: "Contact", to: "/contact", routePath: "/contact" },
];

function isItemActive(path: string): boolean {
  if (path === "/orientation") {
    return route.path === "/orientation" || route.path === "/";
  }
  return route.path === path;
}

function openDrawer() {
  isDrawerOpen.value = true;
  nextTick(() => {
    closeBtnRef.value?.focus();
  });
}

function closeDrawer(restoreFocus: boolean | Event = true) {
  if (!isDrawerOpen.value) return;
  isDrawerOpen.value = false;
  const shouldRestore = typeof restoreFocus === "boolean" ? restoreFocus : true;
  if (shouldRestore && (typeof window === "undefined" || window.innerWidth < DESKTOP_BREAKPOINT)) {
    nextTick(() => {
      hamburgerBtnRef.value?.focus();
    });
  }
}

function toggleDrawer() {
  if (isDrawerOpen.value) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

function onDestinationClick() {
  closeDrawer();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && isDrawerOpen.value) {
    event.preventDefault();
    closeDrawer();
  }
}

function handleResize() {
  if (typeof window !== "undefined" && window.innerWidth >= DESKTOP_BREAKPOINT) {
    if (isDrawerOpen.value) {
      closeDrawer(false);
    }
  }
}

function handleMediaChange(e: MediaQueryListEvent | MediaQueryList) {
  if (e.matches && isDrawerOpen.value) {
    closeDrawer(false);
  }
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", handleResize);

    if (window.matchMedia) {
      mediaQueryList = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener("change", handleMediaChange);
      } else if ("addListener" in mediaQueryList) {
        (mediaQueryList as any).addListener(handleMediaChange);
      }
    }
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", handleResize);

    if (mediaQueryList) {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", handleMediaChange);
      } else if ("removeListener" in mediaQueryList) {
        (mediaQueryList as any).removeListener(handleMediaChange);
      }
    }
  }
});

// Close drawer automatically upon route changes
watch(
  () => route.path,
  () => {
    if (isDrawerOpen.value) {
      closeDrawer();
    }
  }
);
</script>

<template>
  <nav aria-label="Mobile Navigation" class="mobile-nav-container">
    <div class="mobile-nav-bar">
      <!-- Clickable brand identity to Orientation/Home -->
      <div class="mobile-identity">
        <RouterLink
          to="/orientation"
          class="mobile-identity-link"
          aria-label="Adnan Abdullahi — Portfolio Orientation"
          @click="closeDrawer(false)"
        >
          <span class="mobile-identity-name">Adnan Abdullahi</span>
        </RouterLink>
      </div>

      <!-- Hamburger Menu Button per Requirement C.1, C.8 & E -->
      <button
        ref="hamburgerBtnRef"
        type="button"
        class="mobile-hamburger-btn"
        aria-label="Open navigation menu"
        :aria-expanded="isDrawerOpen"
        aria-controls="mobile-nav-drawer"
        @click="toggleDrawer"
      >
        <svg
          class="hamburger-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Backdrop Overlay per Requirement D.2 & D.5 -->
    <Transition name="fade">
      <div
        v-if="isDrawerOpen"
        class="mobile-drawer-backdrop"
        aria-hidden="true"
        @click="closeDrawer()"
      ></div>
    </Transition>

    <!-- Side Navigation Drawer per Requirement C.2, D, E -->
    <Transition name="slide">
      <div
        v-if="isDrawerOpen"
        id="mobile-nav-drawer"
        class="mobile-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        <div class="mobile-drawer-header">
          <span class="mobile-drawer-title">Menu</span>
          <!-- Accessible Close Button per Requirement D.4, D.5 & E -->
          <button
            ref="closeBtnRef"
            type="button"
            class="mobile-drawer-close-btn"
            aria-label="Close navigation menu"
            @click="closeDrawer()"
          >
            <svg
              class="close-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul class="mobile-drawer-list">
          <li
            v-for="item in navItems"
            :key="item.to"
            class="mobile-drawer-item"
          >
            <RouterLink
              :to="item.to"
              class="mobile-drawer-link"
              :class="{ 'mobile-drawer-link--active': isItemActive(item.routePath) }"
              :aria-current="isItemActive(item.routePath) ? 'page' : undefined"
              @click="onDestinationClick"
            >
              <span class="link-label">{{ item.label }}</span>
              <span
                v-if="isItemActive(item.routePath)"
                class="active-indicator-dot"
                aria-hidden="true"
              ></span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.mobile-nav-container {
  display: block;
  position: sticky;
  top: 0;
  z-index: 90;
  width: 100%;
  background-color: var(--color-bg-canvas);
  border-bottom: 1px solid var(--color-border-subtle);
  box-sizing: border-box;
}

/* Hide on desktop viewports (Header.vue active >= 768px) */
@media (min-width: 768px) {
  .mobile-nav-container {
    display: none;
  }
}

.mobile-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  gap: var(--space-3);
  min-height: 48px;
  box-sizing: border-box;
}

.mobile-identity {
  display: flex;
  align-items: center;
}

.mobile-identity-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  transition: color 0.15s ease;
}

.mobile-identity-link:hover {
  color: var(--color-interactive-primary);
}

.mobile-identity-link:hover .mobile-identity-name {
  color: var(--color-interactive-primary);
}

.mobile-identity-link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 4px;
}

.mobile-identity-name {
  font-family: var(--font-family-base);
  font-size: 1.125rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
  line-height: var(--line-height-tight);
  transition: color 0.15s ease;
}

.mobile-hamburger-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--color-bg-canvas);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background-color 0.15s ease;
}

.mobile-hamburger-btn:hover {
  border-color: var(--color-interactive-primary);
  color: var(--color-interactive-primary);
}

.mobile-hamburger-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.hamburger-icon {
  width: 20px;
  height: 20px;
}

/* Backdrop Overlay */
.mobile-drawer-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-surface-overlay, rgba(24, 33, 43, 0.6));
  z-index: 99;
}

/* Side Drawer Panel */
.mobile-drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background-color: var(--color-bg-canvas);
  box-shadow: var(--shadow-elevated, 0 8px 32px rgba(0, 0, 0, 0.45));
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--color-border-subtle);
  box-sizing: border-box;
}

.mobile-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border-subtle);
}

.mobile-drawer-title {
  font-family: var(--font-family-base);
  font-size: 0.875rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mobile-drawer-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--color-bg-canvas);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;
}

.mobile-drawer-close-btn:hover {
  border-color: var(--color-interactive-primary);
  color: var(--color-interactive-primary);
}

.mobile-drawer-close-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.close-icon {
  width: 18px;
  height: 18px;
}

/* Navigation List inside Drawer */
.mobile-drawer-list {
  list-style: none;
  margin: 0;
  padding: var(--space-4) var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.mobile-drawer-item {
  width: 100%;
}

.mobile-drawer-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: var(--font-weight-medium);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.mobile-drawer-link:hover {
  background-color: var(--color-bg-surface);
  color: var(--color-interactive-primary);
}

.mobile-drawer-link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.mobile-drawer-link--active {
  background-color: var(--color-surface-accent, #E3EEF7);
  color: var(--color-interactive-primary);
  font-weight: var(--font-weight-semibold);
}

.active-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-interactive-primary);
  flex-shrink: 0;
}

/* Drawer Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .slide-enter-active,
  .slide-leave-active {
    transition: none !important;
  }
}
</style>
