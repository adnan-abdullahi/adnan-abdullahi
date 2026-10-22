<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface NavItem {
  label: string
  to: string
}

interface ExternalLink {
  label: string
  url: string
  ariaLabel: string
}

const exploreLinks: NavItem[] = [
  { label: 'Home', to: '/orientation' },
  { label: 'Engineering Record', to: '/record' },
  { label: 'Approach', to: '/approach' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const connectLinks: ExternalLink[] = [
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/adnan-abdullahi-a85322172/',
    ariaLabel: 'Adnan Abdullahi on LinkedIn (opens in new tab)',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/adnan-abdullahi/',
    ariaLabel: 'Adnan Abdullahi on GitHub (opens in new tab)',
  },
]
</script>

<template>
  <footer role="contentinfo" class="app-footer-landmark">
    <div class="footer-inner">
      <div class="footer-grid">
        <!-- Area 1: Identity -->
        <div class="footer-column footer-identity">
          <RouterLink
            to="/orientation"
            custom
            v-slot="{ href, navigate }"
          >
            <a
              :href="href"
              class="footer-identity-link"
              aria-label="Adnan Abdullahi — Portfolio Orientation"
              @click="navigate"
            >
              <span class="footer-identity-name">Adnan Abdullahi</span>
            </a>
          </RouterLink>
          <p class="footer-descriptor">
            Computer Scientist • Engineer
          </p>
        </div>

        <!-- Area 2: Explore (Secondary Directory) -->
        <div class="footer-column footer-explore">
          <p class="footer-heading">
            Explore
          </p>
          <nav aria-label="Explore Navigation" class="footer-nav">
            <ul class="footer-link-list">
              <li
                v-for="item in exploreLinks"
                :key="item.to"
                class="footer-link-item"
              >
                <RouterLink
                  :to="item.to"
                  custom
                  v-slot="{ href, navigate }"
                >
                  <a
                    :href="href"
                    class="footer-link"
                    @click="navigate"
                  >
                    {{ item.label }}
                  </a>
                </RouterLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Area 3: Connect (Confirmed Public Profiles) -->
        <div class="footer-column footer-connect">
          <p class="footer-heading">
            Connect
          </p>
          <ul class="footer-link-list">
            <li
              v-for="item in connectLinks"
              :key="item.url"
              class="footer-link-item"
            >
              <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link footer-link--external"
                :aria-label="item.ariaLabel"
              >
                <span>{{ item.label }}</span>
                <span class="external-icon" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Area 4: Copyright -->
      <div class="footer-bottom">
        <p class="footer-copyright">
          © 2026 Adnan Abdullahi
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer-landmark {
  width: 100%;
  background-color: var(--color-surface-accent);
  border-top: 1px solid var(--color-border-subtle);
  box-sizing: border-box;
}

.footer-inner {
  width: 100%;
  max-width: var(--container-max-width, 1440px);
  margin: 0 auto;
  padding: var(--space-8) var(--container-padding-x-mobile, var(--space-4));
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .footer-inner {
    padding: var(--space-10, 40px) var(--container-padding-x-tablet, var(--space-6)) var(--space-8);
  }
}

@media (min-width: 1025px) {
  .footer-inner {
    padding: var(--space-12, 48px) var(--container-padding-x-desktop, 80px) var(--space-8);
  }
}

.footer-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .footer-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: var(--space-8);
    align-items: start;
  }
}

@media (min-width: 1025px) {
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr;
    gap: var(--space-12);
  }
}

.footer-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Identity styling */
.footer-identity {
  flex-shrink: 0;
}

.footer-identity-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  text-decoration: none;
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast, 0.15s ease);
}

.footer-identity-link:hover {
  color: var(--color-interactive-primary);
}

.footer-identity-link:hover .footer-identity-name {
  color: var(--color-interactive-primary);
}

.footer-identity-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.footer-identity-name {
  font-family: var(--font-family-base);
  font-size: 1.25rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  line-height: var(--line-height-tight);
  transition: color var(--transition-fast, 0.15s ease);
}

.footer-descriptor {
  font-family: var(--font-family-base);
  font-size: var(--type-caption-size, 0.75rem);
  font-weight: var(--font-weight-regular, 400);
  color: var(--color-text-secondary);
  line-height: var(--type-caption-line-height, 1.4);
  margin: var(--space-1) 0 0 0;
}

/* Headings for Explore and Connect */
.footer-heading {
  font-family: var(--font-family-base);
  font-size: var(--type-label-size, 0.875rem);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary);
  letter-spacing: var(--type-label-letter-spacing, 0.05em);
  text-transform: uppercase;
  margin: 0 0 var(--space-3) 0;
}

.footer-nav {
  display: flex;
  width: 100%;
}

.footer-link-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--space-1);
  width: 100%;
}

.footer-link-item {
  display: flex;
  align-items: center;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--color-interactive-primary);
  font-family: var(--font-family-base);
  font-size: var(--type-body-small-size, 0.875rem);
  font-weight: var(--font-weight-medium, 500);
  text-decoration: none;
  padding: var(--space-1) 0;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast, 0.15s ease);
}

.footer-link:hover {
  color: var(--color-interactive-hover);
}

.footer-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.footer-link--external {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.external-icon {
  font-size: 0.875em;
  line-height: 1;
  opacity: 0.85;
  transition: transform var(--transition-fast, 0.15s ease);
}

.footer-link:hover .external-icon {
  transform: translate(1px, -1px);
}

/* Copyright section */
.footer-bottom {
  margin-top: var(--space-8);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-subtle);
}

.footer-copyright {
  font-family: var(--font-family-base);
  font-size: var(--type-caption-size, 0.75rem);
  font-weight: var(--font-weight-regular, 400);
  color: var(--color-text-secondary);
  line-height: var(--type-caption-line-height, 1.4);
  margin: 0;
}
</style>
