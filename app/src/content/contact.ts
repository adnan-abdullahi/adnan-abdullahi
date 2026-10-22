/**
 * Approved Text Content: Contact Page
 * Governed by:
 * - docs/CONTACT-BACKEND-SPECIFICATION.md
 */

export interface ContactContent {
  id: "contact";
  pageTitle: string;
  intro: string;
  form: {
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    submitLabel: string;
    submittingLabel: string;
  };
  success: {
    heading: string;
    message: string;
    resetAction: string;
  };
  fieldLimits: {
    nameMaxLength: number;
    emailMaxLength: number;
    messageMaxLength: number;
  };
}

export const contactContent: ContactContent = {
  id: "contact",
  pageTitle: "Contact",
  intro:
    "Have an idea, a technical problem worth exploring, or an engineering opportunity? Send a message below, and let's start a conversation.",
  form: {
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    submitLabel: "Send Message",
    submittingLabel: "Sending...",
  },
  success: {
    heading: "Message Sent",
    message:
      "Message received. Thank you for reaching out — I will review your message and reply via email soon.",
    resetAction: "Send another message",
  },
  fieldLimits: {
    nameMaxLength: 100,
    emailMaxLength: 254,
    messageMaxLength: 5000,
  },
} as const;

export default contactContent;

