/**
 * Approved Text Content: About Page
 * Governed by:
 * - Penpot File: Project 01 — Portfolio Experience
 * - Penpot Page: 03 — Portfolio Screens
 * - Penpot Board: 02 — About — Desktop (ID: 83489379-4891-8034-8008-ba3ce9df904c)
 * - Frozen Step F Content Specification
 */

export interface AboutContent {
  id: "about";
  pageTitle: string;
  aboutMe: {
    heading: string;
    name: string;
    role: string;
    paragraphs: [string, string, string];
  };
  howIWork: {
    heading: string;
    paragraphs: [string, string, string];
    closingPrinciple: string;
  };
  whatIWorkOn: {
    heading: string;
    paragraphs: [string, string, string];
  };
  whereImGoing: {
    heading: string;
    paragraphs: [string, string];
  };
  letsConnect: {
    heading: string;
    paragraphs: [string, string];
    cta: {
      label: string;
      to: string;
      ariaLabel: string;
    };
  };
}

export const aboutContent: AboutContent = {
  id: "about",
  pageTitle: "About",
  aboutMe: {
    heading: "About Me",
    name: "Adnan Abdullahi",
    role: "Computer Scientist • Engineer",
    paragraphs: [
      "I am a computer scientist and engineer developing my practice around understanding problems, making deliberate decisions, building useful solutions, and learning through the process.",
      "I do not see engineering as simply writing code or producing technology. For me, engineering begins with understanding the problem, its context, the people affected by it, and the uncertainty surrounding it.",
      "I believe engineering is more than building technology. It is understanding people and problems, making informed decisions, and using technology responsibly to create useful solutions.",
    ],
  },
  howIWork: {
    heading: "How I Work",
    paragraphs: [
      "My practice develops through investigation, decision-making, building, verification, and learning.",
      "I investigate before assuming. I make decisions consciously when information is incomplete. I build in order to turn understanding into something tangible. I verify what has actually been established rather than relying only on the appearance of success. And when evidence exposes a gap, I treat that gap as part of the engineering work rather than something to hide.",
      "I use technology as an instrument for engineering work. Modern tools, including AI-assisted tools, can support investigation, exploration, implementation, and verification. But they do not replace the responsibility to understand the problem, make judgments, examine evidence, and remain accountable for the result.",
    ],
    closingPrinciple:
      "The technology supports the work. Human understanding and engineering judgment remain central.",
  },
  whatIWorkOn: {
    heading: "What I Work On",
    paragraphs: [
      "I am interested in working through meaningful problems and turning that investigation into useful systems, experiments, and evidence.",
      "My projects are opportunities to develop my ability to understand problems, make engineering decisions, work through uncertainty, and evaluate what has actually been achieved.",
      "This portfolio exists to make that development inspectable. Rather than presenting only finished outputs, I want the work to show how understanding develops: the problems encountered, decisions made, implementations produced, verification performed, revisions introduced, and questions that remain unresolved.",
    ],
  },
  whereImGoing: {
    heading: "Where I'm Going",
    paragraphs: [
      "My engineering practice is still developing. I am working toward becoming increasingly capable of understanding difficult problems, engineering useful solutions, and growing through the experience of working on them.",
      "I do not see learning as something that ends when a particular skill, project, or stage is completed. I see it as a continuous process of questioning, exploring, building, reflecting, and improving. The goal is not to present a finished version of myself, but to keep developing the knowledge, judgment, and practical capability needed to take on increasingly meaningful problems and learn from every problem I encounter.",
    ],
  },
  letsConnect: {
    heading: "Let's Connect",
    paragraphs: [
      "Perhaps the work has given you an idea, raised a problem worth exploring, or revealed a possibility worth turning into something real.",
      "Take it one step further. Bring the idea, problem, or possibility into a conversation, and let's explore what it could become.",
    ],
    cta: {
      label: "Bring an Idea",
      to: "/contact",
      ariaLabel: "Bring an Idea — Go to Contact page",
    },
  },
} as const;

export default aboutContent;
