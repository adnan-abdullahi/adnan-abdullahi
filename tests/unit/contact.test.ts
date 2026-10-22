import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import router from "../../app/src/router";
import type { ExperienceLocation } from "../../app/src/models/experience";
import contactContent from "../../app/src/content/contact";
import ContactView from "../../app/src/views/ContactView.vue";
import Header from "../../app/src/components/Header.vue";

describe("Contact Feature Implementation & Integration", () => {
  beforeEach(async () => {
    await router.push("/");
    await router.isReady();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Routing & Navigation Topology Integration", () => {
    it("verifies route registration and metadata for /contact", () => {
      const route = router.getRoutes().find((r) => r.path === "/contact");
      expect(route).toBeDefined();
      expect(route?.name).toBe("contact");
      expect(route?.meta.title).toBe("Contact");
      expect(route?.meta.location).toBe("contact");
      expect(route?.meta.depth).toBe("entry");
      expect(route?.meta.depthLabel).toBe("Contact");
    });

    it("verifies ExperienceLocation type supports 'contact'", () => {
      const loc: ExperienceLocation = "contact";
      expect(loc).toBe("contact");
    });

    it("verifies Header contextTag is null on /contact route (no PROJECT 01 brand)", async () => {
      await router.push("/contact");
      await router.isReady();

      const wrapper = mount(Header, {
        global: { plugins: [router] },
      });

      const tag = wrapper.find(".project-tag");
      expect(tag.exists()).toBe(false);
    });
  });

  describe("Content Fidelity & Source of Truth", () => {
    it("contains exact approved page title and id", () => {
      expect(contactContent.id).toBe("contact");
      expect(contactContent.pageTitle).toBe("Contact");
    });

    it("contains exact approved introduction narrative", () => {
      expect(contactContent.intro).toBe(
        "Have an idea, a technical problem worth exploring, or an engineering opportunity? Send a message below, and let's start a conversation."
      );
    });

    it("contains exact approved success confirmation receipt text", () => {
      expect(contactContent.success.message).toBe(
        "Message received. Thank you for reaching out — I will review your message and reply via email soon."
      );
      expect(contactContent.success.resetAction).toBe("Send another message");
      expect(contactContent.success.heading).toBe("Message Sent");
    });

    it("enforces approved field limits in content definition", () => {
      expect(contactContent.fieldLimits.nameMaxLength).toBe(100);
      expect(contactContent.fieldLimits.emailMaxLength).toBe(254);
      expect(contactContent.fieldLimits.messageMaxLength).toBe(5000);
    });
  });

  describe("ContactView Component Rendering & Accessibility", () => {
    it("renders h1#main-heading with tabindex -1 for focus management", () => {
      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      const heading = wrapper.find("h1#main-heading");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("Contact");
      expect(heading.attributes("tabindex")).toBe("-1");
    });

    it("renders introduction narrative paragraph", () => {
      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      const intro = wrapper.find(".intro-paragraph");
      expect(intro.exists()).toBe(true);
      expect(intro.text()).toBe(contactContent.intro);
    });

    it("renders accessible form with name, email, and message inputs", () => {
      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      const form = wrapper.find("form.contact-form");
      expect(form.exists()).toBe(true);
      expect(form.attributes("aria-labelledby")).toBe("main-heading");

      // Name input
      const nameInput = wrapper.find("input#contact-name");
      expect(nameInput.exists()).toBe(true);
      expect(nameInput.attributes("type")).toBe("text");
      expect(nameInput.attributes("maxlength")).toBe("100");
      expect(nameInput.attributes("required")).toBeDefined();
      const nameLabel = wrapper.find('label[for="contact-name"]');
      expect(nameLabel.exists()).toBe(true);
      expect(nameLabel.text()).toContain("Name");

      // Email input
      const emailInput = wrapper.find("input#contact-email");
      expect(emailInput.exists()).toBe(true);
      expect(emailInput.attributes("type")).toBe("email");
      expect(emailInput.attributes("maxlength")).toBe("254");
      expect(emailInput.attributes("required")).toBeDefined();
      const emailLabel = wrapper.find('label[for="contact-email"]');
      expect(emailLabel.exists()).toBe(true);
      expect(emailLabel.text()).toContain("Email");

      // Message textarea
      const messageTextarea = wrapper.find("textarea#contact-message");
      expect(messageTextarea.exists()).toBe(true);
      expect(messageTextarea.attributes("maxlength")).toBe("5000");
      expect(messageTextarea.attributes("required")).toBeDefined();
      const messageLabel = wrapper.find('label[for="contact-message"]');
      expect(messageLabel.exists()).toBe(true);
      expect(messageLabel.text()).toContain("Message");

      // Submit button
      const submitBtn = wrapper.find("button.btn-submit");
      expect(submitBtn.exists()).toBe(true);
      expect(submitBtn.text()).toContain("Send Message");
    });

    it("renders invisible honeypot field with aria-hidden and tabindex -1", () => {
      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      const honeypotWrap = wrapper.find(".honeypot-field");
      expect(honeypotWrap.exists()).toBe(true);
      expect(honeypotWrap.attributes("aria-hidden")).toBe("true");

      const honeypotInput = wrapper.find("input#contact-website");
      expect(honeypotInput.exists()).toBe(true);
      expect(honeypotInput.attributes("tabindex")).toBe("-1");
      expect(honeypotInput.attributes("autocomplete")).toBe("off");
    });

    it("does not render any mailto link or recipient email address", () => {
      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      expect(wrapper.html()).not.toContain("mailto:");
      expect(wrapper.html()).not.toContain("@gmail.com");
      expect(wrapper.html()).not.toContain("@localhost");
    });
  });

  describe("Client-side Form Validation", () => {
    it("blocks submission and shows field errors when submitted empty", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("form.contact-form").trigger("submit.prevent");

      expect(fetchSpy).not.toHaveBeenCalled();

      // Field error messages
      expect(wrapper.find("#contact-name-error").exists()).toBe(true);
      expect(wrapper.find("#contact-name-error").text()).toBe("Please enter your name.");
      expect(wrapper.find("#contact-email-error").exists()).toBe(true);
      expect(wrapper.find("#contact-email-error").text()).toBe("Please enter your email address.");
      expect(wrapper.find("#contact-message-error").exists()).toBe(true);
      expect(wrapper.find("#contact-message-error").text()).toBe("Please enter your message.");

      // Form alert banner
      expect(wrapper.find("#contact-form-error").exists()).toBe(true);
    });

    it("rejects newline characters in name", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      (wrapper.vm as any).form.name = "First\nLast";
      (wrapper.vm as any).form.email = "user@example.com";
      (wrapper.vm as any).form.message = "Valid inquiry text.";

      await wrapper.find("form.contact-form").trigger("submit.prevent");

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(wrapper.find("#contact-name-error").text()).toBe("Name cannot contain newline characters.");
    });

    it("rejects newline characters in email", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      (wrapper.vm as any).form.name = "Valid Name";
      (wrapper.vm as any).form.email = "user\r\n@example.com";
      (wrapper.vm as any).form.message = "Valid inquiry text.";

      await wrapper.find("form.contact-form").trigger("submit.prevent");

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(wrapper.find("#contact-email-error").text()).toBe("Email address cannot contain newline characters.");
    });

    it("rejects invalid email syntax", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Valid Name");
      await wrapper.find("input#contact-email").setValue("not-an-email");
      await wrapper.find("textarea#contact-message").setValue("Valid inquiry text.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(wrapper.find("#contact-email-error").text()).toBe("Please enter a valid email address.");
    });
  });

  describe("API Submission, Success State & Reset Workflow", () => {
    it("submits valid payload to /api/contact/ with correct parameters", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "success",
            message: contactContent.success.message,
            id: "11111111-2222-3333-4444-555555555555",
          }),
          { status: 201, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Inquiry regarding analytical engines.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, options] = fetchSpy.mock.calls[0];
      expect(url).toBe("/api/contact/");
      expect(options?.method).toBe("POST");
      expect(JSON.parse(options?.body as string)).toEqual({
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Inquiry regarding analytical engines.",
        website: "",
      });
    });

    it("replaces form with exact confirmed receipt message upon HTTP 201", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "success",
            message: contactContent.success.message,
            id: "11111111-2222-3333-4444-555555555555",
          }),
          { status: 201, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Exploring collaboration possibilities.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Form is no longer visible
      expect(wrapper.find("form.contact-form").exists()).toBe(false);

      // Success section is visible with exact receipt text
      const successSection = wrapper.find("#contact-success");
      expect(successSection.exists()).toBe(true);
      expect(successSection.attributes("role")).toBe("status");
      expect(successSection.attributes("aria-live")).toBe("polite");

      const successBody = wrapper.find(".success-body");
      expect(successBody.text()).toBe(
        "Message received. Thank you for reaching out — I will review your message and reply via email soon."
      );

      const resetBtn = wrapper.find("button.btn-reset");
      expect(resetBtn.exists()).toBe(true);
      expect(resetBtn.text()).toBe("Send another message");
    });

    it("resets form fields and returns to empty form state when clicking 'Send another message'", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "success",
            message: contactContent.success.message,
            id: "11111111-2222-3333-4444-555555555555",
          }),
          { status: 201, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
        attachTo: document.body,
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Initial message.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(wrapper.find("#contact-success").exists()).toBe(true);

      // Click "Send another message"
      await wrapper.find("button.btn-reset").trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Form is visible again
      expect(wrapper.find("form.contact-form").exists()).toBe(true);
      expect(wrapper.find("#contact-success").exists()).toBe(false);

      // Form inputs are cleared
      const nameInput = wrapper.find<HTMLInputElement>("input#contact-name");
      const emailInput = wrapper.find<HTMLInputElement>("input#contact-email");
      const messageTextarea = wrapper.find<HTMLTextAreaElement>("textarea#contact-message");

      expect(nameInput.element.value).toBe("");
      expect(emailInput.element.value).toBe("");
      expect(messageTextarea.element.value).toBe("");

      wrapper.unmount();
    });

    it("disables submit button and shows loading state while submission is in-flight", async () => {
      let resolvePromise: (val: Response) => void;
      const deferredPromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });

      vi.spyOn(globalThis, "fetch").mockReturnValueOnce(deferredPromise);

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("In-flight test message.");

      // Submit form
      const form = wrapper.find("form.contact-form");
      await form.trigger("submit.prevent");

      // While in-flight:
      const submitBtn = wrapper.find("button.btn-submit");
      expect(submitBtn.attributes("disabled")).toBeDefined();
      expect(submitBtn.attributes("aria-busy")).toBe("true");
      expect(submitBtn.text()).toContain("Sending...");
      expect(wrapper.find(".spinner").exists()).toBe(true);

      // Second click should not trigger another fetch
      await form.trigger("submit.prevent");
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);

      // Resolve request
      resolvePromise!(
        new Response(
          JSON.stringify({
            status: "success",
            message: contactContent.success.message,
            id: "11111111-2222-3333-4444-555555555555",
          }),
          { status: 201, headers: { "Content-Type": "application/json" } }
        )
      );

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(wrapper.find("#contact-success").exists()).toBe(true);
    });
  });

  describe("Error Handling & Input Preservation", () => {
    it("handles 400 Bad Request with field errors while preserving entered values", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            email: ["Enter a valid email address."],
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Important engineering inquiry.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Form remains visible
      expect(wrapper.find("form.contact-form").exists()).toBe(true);

      // User values preserved
      expect(wrapper.find<HTMLInputElement>("input#contact-name").element.value).toBe("Ada Lovelace");
      expect(wrapper.find<HTMLInputElement>("input#contact-email").element.value).toBe("ada@example.com");
      expect(wrapper.find<HTMLTextAreaElement>("textarea#contact-message").element.value).toBe(
        "Important engineering inquiry."
      );

      // Error shown
      expect(wrapper.find("#contact-email-error").text()).toBe("Enter a valid email address.");
      expect(wrapper.find("#contact-form-error").exists()).toBe(true);
    });

    it("handles nested server validation errors in data.errors structure", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "error",
            errors: {
              name: ["Ensure this field has no more than 100 characters."],
              email: ["Enter a valid email address."],
              message: ["This field may not be blank."],
            },
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Valid inquiry text.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Form remains visible and inputs preserved
      expect(wrapper.find("form.contact-form").exists()).toBe(true);
      expect(wrapper.find<HTMLInputElement>("input#contact-name").element.value).toBe("Ada Lovelace");
      expect(wrapper.find<HTMLInputElement>("input#contact-email").element.value).toBe("ada@example.com");
      expect(wrapper.find<HTMLTextAreaElement>("textarea#contact-message").element.value).toBe("Valid inquiry text.");

      // Errors displayed against appropriate fields
      expect(wrapper.find("#contact-name-error").text()).toBe("Ensure this field has no more than 100 characters.");
      expect(wrapper.find("#contact-email-error").text()).toBe("Enter a valid email address.");
      expect(wrapper.find("#contact-message-error").text()).toBe("This field may not be blank.");
      expect(wrapper.find("#contact-form-error").exists()).toBe(true);
    });

    it("displays the first message for array-valued errors", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "error",
            errors: {
              email: [
                "Primary error: email is invalid.",
                "Secondary error: domain not found.",
              ],
            },
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Valid inquiry text.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(wrapper.find("#contact-email-error").text()).toBe("Primary error: email is invalid.");
      expect(wrapper.find<HTMLInputElement>("input#contact-email").element.value).toBe("ada@example.com");
    });

    it("handles scalar-valued errors safely in nested errors structure", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "error",
            errors: {
              name: "Name format is disallowed.",
              email: "Email address failed verification.",
              message: "Message contains restricted keywords.",
            },
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Valid inquiry text.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(wrapper.find("#contact-name-error").text()).toBe("Name format is disallowed.");
      expect(wrapper.find("#contact-email-error").text()).toBe("Email address failed verification.");
      expect(wrapper.find("#contact-message-error").text()).toBe("Message contains restricted keywords.");
      expect(wrapper.find<HTMLInputElement>("input#contact-name").element.value).toBe("Ada Lovelace");
    });

    it("handles scalar-valued errors safely in root-level structure", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            name: "Root scalar name error.",
            message: "Root scalar message error.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Valid inquiry text.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(wrapper.find("#contact-name-error").text()).toBe("Root scalar name error.");
      expect(wrapper.find("#contact-message-error").text()).toBe("Root scalar message error.");
      expect(wrapper.find<HTMLInputElement>("input#contact-name").element.value).toBe("Ada Lovelace");
    });

    it("handles 429 Too Many Requests while preserving entered values", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            detail: "Request was throttled. Expected available in 3600 seconds.",
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Throttled submission inquiry.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Form remains visible with preserved inputs
      expect(wrapper.find<HTMLInputElement>("input#contact-name").element.value).toBe("Ada Lovelace");
      expect(wrapper.find<HTMLTextAreaElement>("textarea#contact-message").element.value).toBe(
        "Throttled submission inquiry."
      );

      // Polite rate limit alert
      const alert = wrapper.find("#contact-form-error");
      expect(alert.exists()).toBe(true);
      expect(alert.text()).toContain("Too many requests");
    });

    it("handles 500 Internal Server Error without exposing internal details", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "error",
            message: "Unable to save your message at this time. Please try again shortly.",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        )
      );

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Server error test inquiry.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Preserved values
      expect(wrapper.find<HTMLInputElement>("input#contact-name").element.value).toBe("Ada Lovelace");

      // Courteous error
      const alert = wrapper.find("#contact-form-error");
      expect(alert.exists()).toBe(true);
      expect(alert.text()).toContain("Unable to save your message at this time");

      // Verify no database error or stack trace is exposed
      expect(wrapper.html()).not.toContain("MySQL");
      expect(wrapper.html()).not.toContain("OperationalError");
      expect(wrapper.html()).not.toContain("Traceback");
    });

    it("handles network failure / connection drop gracefully while preserving entered values", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new TypeError("Failed to fetch"));

      const wrapper = mount(ContactView, {
        global: { plugins: [router] },
      });

      await wrapper.find("input#contact-name").setValue("Ada Lovelace");
      await wrapper.find("input#contact-email").setValue("ada@example.com");
      await wrapper.find("textarea#contact-message").setValue("Offline test inquiry.");

      await wrapper.find("form.contact-form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Preserved values
      expect(wrapper.find<HTMLInputElement>("input#contact-name").element.value).toBe("Ada Lovelace");
      expect(wrapper.find<HTMLTextAreaElement>("textarea#contact-message").element.value).toBe(
        "Offline test inquiry."
      );

      // Network error banner
      const alert = wrapper.find("#contact-form-error");
      expect(alert.exists()).toBe(true);
      expect(alert.text()).toContain("Network error");
    });
  });
});

