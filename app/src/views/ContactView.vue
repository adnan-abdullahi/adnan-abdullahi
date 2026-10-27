<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import { resolveApiUrl, ApiConfigurationError } from "@/config/api";
import contactContent from "@/content/contact";

const content = contactContent;

// Form state
interface FormState {
  name: string;
  email: string;
  message: string;
  website: string; // Honeypot field
}

const form = reactive<FormState>({
  name: "",
  email: "",
  message: "",
  website: "",
});

const isSubmitting = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref<string | null>(null);
const fieldErrors = reactive<{
  name?: string;
  email?: string;
  message?: string;
}>({});

// DOM element references for accessible focus management
const nameInputRef = ref<HTMLInputElement | null>(null);
const emailInputRef = ref<HTMLInputElement | null>(null);
const messageInputRef = ref<HTMLTextAreaElement | null>(null);
const successContainerRef = ref<HTMLElement | null>(null);
const errorAlertRef = ref<HTMLElement | null>(null);

// Email syntax validation regex (standard HTML5 RFC 5322 compatible)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates form inputs client-side before submission.
 * Enforces field lengths, presence, email format, and rejects newline characters in name/email.
 */
function validateClientSide(): boolean {
  // Clear previous errors
  fieldErrors.name = undefined;
  fieldErrors.email = undefined;
  fieldErrors.message = undefined;
  errorMessage.value = null;

  let isValid = true;
  let firstInvalidField: "name" | "email" | "message" | null = null;

  const trimmedName = form.name.trim();
  const trimmedEmail = form.email.trim();
  const trimmedMessage = form.message.trim();

  // 1. Validate Name
  if (!trimmedName) {
    fieldErrors.name = "Please enter your name.";
    isValid = false;
    firstInvalidField = firstInvalidField || "name";
  } else if (/[\r\n]/.test(form.name)) {
    fieldErrors.name = "Name cannot contain newline characters.";
    isValid = false;
    firstInvalidField = firstInvalidField || "name";
  } else if (trimmedName.length > content.fieldLimits.nameMaxLength) {
    fieldErrors.name = `Name cannot exceed ${content.fieldLimits.nameMaxLength} characters.`;
    isValid = false;
    firstInvalidField = firstInvalidField || "name";
  }

  // 2. Validate Email
  if (!trimmedEmail) {
    fieldErrors.email = "Please enter your email address.";
    isValid = false;
    firstInvalidField = firstInvalidField || "email";
  } else if (/[\r\n]/.test(form.email)) {
    fieldErrors.email = "Email address cannot contain newline characters.";
    isValid = false;
    firstInvalidField = firstInvalidField || "email";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    fieldErrors.email = "Please enter a valid email address.";
    isValid = false;
    firstInvalidField = firstInvalidField || "email";
  } else if (trimmedEmail.length > content.fieldLimits.emailMaxLength) {
    fieldErrors.email = `Email cannot exceed ${content.fieldLimits.emailMaxLength} characters.`;
    isValid = false;
    firstInvalidField = firstInvalidField || "email";
  }

  // 3. Validate Message
  if (!trimmedMessage) {
    fieldErrors.message = "Please enter your message.";
    isValid = false;
    firstInvalidField = firstInvalidField || "message";
  } else if (trimmedMessage.length > content.fieldLimits.messageMaxLength) {
    fieldErrors.message = `Message cannot exceed ${content.fieldLimits.messageMaxLength} characters.`;
    isValid = false;
    firstInvalidField = firstInvalidField || "message";
  }

  if (!isValid) {
    errorMessage.value = "Please correct the highlighted errors before sending.";
    nextTick(() => {
      if (firstInvalidField === "name") {
        nameInputRef.value?.focus();
      } else if (firstInvalidField === "email") {
        emailInputRef.value?.focus();
      } else if (firstInvalidField === "message") {
        messageInputRef.value?.focus();
      }
    });
  }

  return isValid;
}

/**
 * Handles form submission: validates, transmits to POST /api/contact/,
 * and transitions state cleanly based on backend response.
 */
async function handleSubmit() {
  if (isSubmitting.value) {
    return;
  }

  if (!validateClientSide()) {
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = null;

  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    message: form.message.trim(),
    website: form.website, // Invisible honeypot
  };

  try {
    const endpoint = resolveApiUrl("/api/contact/");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 201) {
      // Confirmed database receipt
      isSubmitted.value = true;
      await nextTick();
      successContainerRef.value?.focus();
    } else if (response.status === 400) {
      const data = await response.json().catch(() => ({}));
      if (data.website || data.message === "Invalid submission.") {
        errorMessage.value = "Submission could not be processed. Please check your input.";
      } else {
        const errors =
          data && typeof data.errors === "object" && data.errors !== null
            ? data.errors
            : data;
        if (errors.name) {
          fieldErrors.name = Array.isArray(errors.name)
            ? String(errors.name[0] ?? "")
            : String(errors.name);
        }
        if (errors.email) {
          fieldErrors.email = Array.isArray(errors.email)
            ? String(errors.email[0] ?? "")
            : String(errors.email);
        }
        if (errors.message) {
          fieldErrors.message = Array.isArray(errors.message)
            ? String(errors.message[0] ?? "")
            : String(errors.message);
        }
        errorMessage.value = "Please correct the errors indicated below.";
      }
      await nextTick();
      errorAlertRef.value?.focus();
    } else if (response.status === 429) {
      errorMessage.value = "Too many requests. Please wait a few moments before trying again.";
      await nextTick();
      errorAlertRef.value?.focus();
    } else {
      errorMessage.value = "Unable to save your message at this time. Please try again shortly.";
      await nextTick();
      errorAlertRef.value?.focus();
    }
  } catch (error) {
    if (error instanceof ApiConfigurationError) {
      console.error("[Contact Form Configuration Error]:", error.message);
      errorMessage.value = "Unable to send message due to a service configuration issue. Please try again shortly.";
    } else {
      errorMessage.value = "Network error. Please check your connection and try again.";
    }
    await nextTick();
    errorAlertRef.value?.focus();
  } finally {
    isSubmitting.value = false;
  }
}

/**
 * Resets the contact form to allow sending another inquiry.
 * Programmatically returns focus to the Name input.
 */
async function handleReset() {
  form.name = "";
  form.email = "";
  form.message = "";
  form.website = "";
  fieldErrors.name = undefined;
  fieldErrors.email = undefined;
  fieldErrors.message = undefined;
  errorMessage.value = null;
  isSubmitted.value = false;

  await nextTick();
  nameInputRef.value?.focus();
}

defineExpose({
  form,
  isSubmitting,
  isSubmitted,
  fieldErrors,
  errorMessage,
  validateClientSide,
  handleSubmit,
  handleReset,
});
</script>

<template>
  <div class="contact-view">
    <!-- Page Header Landmark & Title -->
    <header class="contact-header">
      <h1 id="main-heading" class="page-title" tabindex="-1">
        {{ content.pageTitle }}
      </h1>
    </header>

    <!-- Reading Container: 720px max-width, left-aligned, single-column -->
    <div class="reading-container">
      <p class="intro-paragraph">
        {{ content.intro }}
      </p>

      <!-- Success State: replaces form when message is safely received -->
      <section
        v-if="isSubmitted"
        id="contact-success"
        ref="successContainerRef"
        class="success-section"
        tabindex="-1"
        role="status"
        aria-live="polite"
        aria-labelledby="success-heading"
      >
        <div class="success-card">
          <div class="success-icon-wrap" aria-hidden="true">
            <svg
              class="success-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 id="success-heading" class="success-title">
            {{ content.success.heading }}
          </h2>
          <p class="success-body">
            {{ content.success.message }}
          </p>
          <div class="success-actions">
            <button
              type="button"
              class="btn-reset"
              @click="handleReset"
            >
              {{ content.success.resetAction }}
            </button>
          </div>
        </div>
      </section>

      <!-- Contact Form: displayed when not submitted -->
      <form
        v-else
        class="contact-form"
        novalidate
        aria-labelledby="main-heading"
        @submit.prevent="handleSubmit"
      >
        <!-- General Error Alert Banner -->
        <div
          v-if="errorMessage"
          id="contact-form-error"
          ref="errorAlertRef"
          class="alert-banner"
          role="alert"
          tabindex="-1"
        >
          <span class="alert-icon" aria-hidden="true">!</span>
          <span class="alert-message">{{ errorMessage }}</span>
        </div>

        <!-- Invisible Honeypot Field (Spam Defense) -->
        <div class="honeypot-field" aria-hidden="true">
          <label for="contact-website">Website</label>
          <input
            id="contact-website"
            v-model="form.website"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        <!-- Name Field -->
        <div class="form-group" :class="{ 'form-group--error': fieldErrors.name }">
          <label for="contact-name" class="form-label">
            {{ content.form.nameLabel }}
            <span class="required-indicator" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            ref="nameInputRef"
            v-model="form.name"
            type="text"
            name="name"
            :maxlength="content.fieldLimits.nameMaxLength"
            required
            class="form-input"
            :class="{ 'form-input--error': fieldErrors.name }"
            :aria-invalid="fieldErrors.name ? 'true' : 'false'"
            :aria-describedby="fieldErrors.name ? 'contact-name-error' : undefined"
            :disabled="isSubmitting"
            autocomplete="name"
          />
          <p
            v-if="fieldErrors.name"
            id="contact-name-error"
            class="field-error"
            role="alert"
          >
            {{ fieldErrors.name }}
          </p>
        </div>

        <!-- Email Field -->
        <div class="form-group" :class="{ 'form-group--error': fieldErrors.email }">
          <label for="contact-email" class="form-label">
            {{ content.form.emailLabel }}
            <span class="required-indicator" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            ref="emailInputRef"
            v-model="form.email"
            type="email"
            name="email"
            :maxlength="content.fieldLimits.emailMaxLength"
            required
            class="form-input"
            :class="{ 'form-input--error': fieldErrors.email }"
            :aria-invalid="fieldErrors.email ? 'true' : 'false'"
            :aria-describedby="fieldErrors.email ? 'contact-email-error' : undefined"
            :disabled="isSubmitting"
            autocomplete="email"
          />
          <p
            v-if="fieldErrors.email"
            id="contact-email-error"
            class="field-error"
            role="alert"
          >
            {{ fieldErrors.email }}
          </p>
        </div>

        <!-- Message Field -->
        <div class="form-group" :class="{ 'form-group--error': fieldErrors.message }">
          <div class="label-row">
            <label for="contact-message" class="form-label">
              {{ content.form.messageLabel }}
              <span class="required-indicator" aria-hidden="true">*</span>
            </label>
            <span
              class="char-counter"
              :class="{ 'char-counter--warn': form.message.length >= content.fieldLimits.messageMaxLength - 100 }"
              aria-live="polite"
              aria-atomic="true"
            >
              {{ form.message.length }} / {{ content.fieldLimits.messageMaxLength }}
            </span>
          </div>
          <textarea
            id="contact-message"
            ref="messageInputRef"
            v-model="form.message"
            name="message"
            rows="6"
            :maxlength="content.fieldLimits.messageMaxLength"
            required
            class="form-textarea"
            :class="{ 'form-textarea--error': fieldErrors.message }"
            :aria-invalid="fieldErrors.message ? 'true' : 'false'"
            :aria-describedby="fieldErrors.message ? 'contact-message-error' : undefined"
            :disabled="isSubmitting"
          ></textarea>
          <p
            v-if="fieldErrors.message"
            id="contact-message-error"
            class="field-error"
            role="alert"
          >
            {{ fieldErrors.message }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn-submit"
            :disabled="isSubmitting"
            :aria-busy="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner" aria-hidden="true"></span>
            <span>{{ isSubmitting ? content.form.submittingLabel : content.form.submitLabel }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Page Layout (mirrors AboutView editorial structure) */
.contact-view {
  width: 100%;
  padding: var(--space-8) 0 64px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .contact-view {
    padding: var(--space-10, 40px) 0 80px;
  }
}

@media (min-width: 1025px) {
  .contact-view {
    padding: 42px 0 101px;
  }
}

/* Page Header & Title */
.contact-header {
  margin-bottom: var(--space-8, 32px);
}

.page-title {
  color: var(--color-text-primary);
  margin: 0;
  font-family: var(--font-family-base);
  font-size: clamp(2.25rem, 4vw, 3rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
  letter-spacing: -0.02em;
  outline: none;
}

/* Single-Column Editorial Reading Width */
.reading-container {
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Introduction Paragraph */
.intro-paragraph {
  color: var(--color-text-secondary);
  font-family: var(--font-family-base);
  font-size: 1.125rem;
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
  margin: 0 0 var(--space-8, 32px);
}

/* Form Structure */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6, 24px);
}

/* Honeypot: visually hidden & unclickable */
.honeypot-field {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  opacity: 0;
  pointer-events: none;
}

/* Form Groups & Labels */
.form-group {
  display: flex;
  flex-direction: column;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.form-label {
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: 0.9375rem;
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2, 8px);
}

.required-indicator {
  color: var(--primitive-red-400);
  margin-left: 2px;
}

.char-counter {
  color: var(--color-text-muted);
  font-family: var(--font-family-base);
  font-size: 0.8125rem;
}

.char-counter--warn {
  color: var(--primitive-amber-400);
  font-weight: var(--font-weight-semibold);
}

/* Inputs & Textareas */
.form-input,
.form-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  background-color: var(--color-bg-canvas);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  font-family: var(--font-family-base);
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}

.form-textarea {
  resize: vertical;
  min-height: 140px;
}

.form-input:hover:not(:disabled),
.form-textarea:hover:not(:disabled) {
  border-color: var(--color-border-strong);
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 2px var(--color-surface-accent);
}

.form-input:disabled,
.form-textarea:disabled {
  background-color: var(--color-bg-surface);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

/* Error States */
.form-input--error,
.form-textarea--error {
  border-color: var(--primitive-red-400) !important;
}

.form-input--error:focus,
.form-textarea--error:focus {
  box-shadow: 0 0 0 2px rgba(217, 74, 74, 0.2) !important;
}

.field-error {
  color: var(--primitive-red-400);
  font-family: var(--font-family-base);
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  margin: var(--space-2, 8px) 0 0;
  line-height: 1.4;
}

/* Alert Banner */
.alert-banner {
  display: flex;
  align-items: center;
  gap: var(--space-3, 12px);
  padding: 14px 18px;
  background-color: #FDF2F2;
  border: 1px solid var(--primitive-red-400);
  border-radius: 6px;
  color: #991B1B;
  font-family: var(--font-family-base);
  font-size: 0.9375rem;
  outline: none;
}

.alert-banner:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.alert-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--primitive-red-400);
  color: #FFFFFF;
  font-weight: bold;
  font-size: 0.8125rem;
  flex-shrink: 0;
}

.alert-message {
  line-height: 1.4;
}

/* Submit Button & Actions */
.form-actions {
  margin-top: var(--space-2, 8px);
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 52px;
  min-width: 180px;
  padding: 0 var(--space-6, 24px);
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-interactive);
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-interactive-hover);
}

.btn-submit:active:not(:disabled) {
  background-color: var(--color-interactive-active);
}

.btn-submit:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 3px;
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Success Confirmation State */
.success-section {
  outline: none;
}

.success-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-8, 32px);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
}

.success-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(58, 95, 58, 0.12);
  color: var(--color-status-verified);
  margin-bottom: var(--space-4, 16px);
}

.success-icon {
  width: 26px;
  height: 26px;
}

.success-title {
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  line-height: 1.25;
  margin: 0 0 var(--space-3, 12px);
}

.success-body {
  color: var(--color-text-secondary);
  font-family: var(--font-family-base);
  font-size: 1.0625rem;
  line-height: 1.6;
  margin: 0 0 var(--space-6, 24px);
}

.success-actions {
  display: flex;
}

.btn-reset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 var(--space-5, 20px);
  background-color: transparent;
  color: var(--color-interactive-primary);
  border: 1px solid var(--color-interactive-primary);
  border-radius: var(--radius-sm);
  font-family: var(--font-family-base);
  font-size: 0.9375rem;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-reset:hover {
  background-color: var(--color-surface-accent);
  color: var(--color-interactive-hover);
}

.btn-reset:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 3px;
}
</style>

