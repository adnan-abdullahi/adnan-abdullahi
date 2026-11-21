# Portfolio Enhancement Research — Discovery Charter

**Status:** PROPOSED — DISCOVERY AND RESEARCH ONLY (IMPLEMENTATION NOT AUTHORIZED)
**Date Established:** 2026-11-21
**Project:** Project 01 — Professional Engineering Portfolio
**Governing Project Record:** `docs/PROJECT-01.md`
**Preceding Closed Stage:** Stage 09 — Evaluation (Complete, Accepted and Closed on 2026-11-15)
**Paused Lifecycle Stage:** Stage 10 — Reflection and Growth (`ON HOLD — TEMPORARILY PAUSED BY PROJECT OWNER` on 2026-11-21)

---

## 1. Context and Governance Boundary

Following the completion, acceptance, and closure of Stage 09 — Evaluation (`2026-11-15`), the portfolio is live in production (`https://adnanabdullahi.com` and `https://api.adnanabdullahi.com`). On `2026-11-21`, the project owner accepted Stage 10.1 and placed the entire **Stage 10 — Reflection and Growth** (including incomplete **Stage 10.2 — Engineering Capability and Gap Assessment**) temporarily on hold:

> "Stage 10 is temporarily placed on hold to prioritise investigation and research into two proposed portfolio enhancements: an AI Portfolio Assistant and a Downloadable CV. These enhancements will be investigated before the next portfolio evaluation and preparation of Version 1.01."

This charter establishes the discovery boundary for those two proposed portfolio enhancements. In strict accordance with `docs/PROJECT-01.md`, this initiative is a pre-implementation research track and **does not** introduce a new stage number (such as "Stage 11") to the existing ten-stage Project Development Model.

### Lightweight Stage / Initiative Boundary

- **Purpose:** Investigate feasibility, user value, content governance, architectural options, constraints, risks, and cost implications for two proposed portfolio enhancements prior to any implementation decision or Version 1.01 preparation.
- **Scope:**
  1. **Research Area 1 — AI Portfolio Assistant** (discovery, architecture options, data boundaries, security, privacy, and cost analysis).
  2. **Research Area 2 — Downloadable CV** (format evaluation for PDF and Word `.docx`, placement, structure, maintenance, accessibility, and privacy/disclosure analysis).
- **Non-Scope (Explicitly Prohibited Without Separate Owner Authorization):**
  - Writing application source code, UI components, backend endpoints, or automated tests for either enhancement.
  - Generating, styling, or publishing CV documents to the live site.
  - Selecting, subscribing to, or configuring external AI providers, APIs, or paid hosting tiers.
  - Modifying production infrastructure (Cloudflare Worker, Render Starter, TiDB Cloud Serverless, Resend) or deploying changes.
  - Assuming implementation approval from research completion.
- **Expected Outcome:** Written discovery findings, clearly bounded requirements options, identified constraints/risks, and concrete decision proposals for the project owner to review.
- **Acceptance:** Project owner review of discovery findings and explicit human decision on whether to authorize specification/implementation, defer, or reject each enhancement.
- **Authorization:** This charter establishes research scope only. Every decision remains subject to `Proposal → Human Decision → Authorization → Execution → Verification`.

---

## 2. Research Area 1 — AI Portfolio Assistant

### 2.1 Proposed Concept and Purpose

Investigate an AI-powered conversational assistant integrated into the portfolio website to help visitors understand the portfolio owner's professional background, ask questions, and discover relevant portfolio information.

### 2.2 Potential Approved Information Domain

Subject to discovery and owner boundary approval, the assistant would be restricted to approved professional information about the portfolio owner, potentially including:
- Educational background.
- Professional experience.
- Engineering skills and capabilities.
- Projects and portfolio work.
- Professional background and location.
- Information about navigating and understanding the portfolio website.

### 2.3 Matters Requiring Investigation Before Any Implementation Decision

The exact functionality, technical architecture, and operational boundaries have **not** yet been established. Discovery must investigate:
1. **Functionality and Visitor Value:** What concrete visitor questions or navigation friction would the assistant solve beyond the existing portfolio structure, and how should uncertainty or out-of-scope questions be handled?
2. **Technical Architecture:** How could a conversational endpoint and UI integrate cleanly with the current architecture (Vue 3 + TypeScript static frontend on Cloudflare Worker, Django REST backend on Render Starter, TiDB Cloud Serverless), and what latency or state constraints apply?
3. **Authoritative Data Sources and Grounding:** How will approved owner information be structured, updated, and verified so the assistant does not fabricate claims, misrepresent evidence, or contradict Project 01 records?
4. **AI Provider Selection and Cost Boundaries:** Which model/API providers are viable within owner-approved budget constraints, including token/request quotas and ongoing recurring cost exposure?
5. **Security Boundaries:** How will prompt injection, off-topic abuse, automated scraping/cost exhaustion, rate limiting (`CF-Connecting-IP`), and origin protection (`X-Origin-Secret`) be governed?
6. **Privacy Considerations:** What visitor input/conversation logging (if any) is appropriate, and what privacy disclosures or data-retention limits are required?
7. **Implementation Approach and Feasibility:** What is the simplest, maintainable implementation path if later authorized, and does it preserve existing accessibility, visual design foundations, and production reliability?

---

## 3. Research Area 2 — Downloadable CV

### 3.1 Proposed Concept and Purpose

Investigate providing downloadable professional CV documents through the portfolio website so visitors (such as recruiters, hiring managers, and engineering peers) can obtain an offline-readable summary of the owner's qualifications and work.

### 3.2 Potential Formats Under Evaluation

- **PDF**
- **Microsoft Word (`.docx`)**

### 3.3 Matters Requiring Investigation Before Any Implementation Decision

The exact requirements and implementation approach remain undecided. Discovery must investigate:
1. **Portfolio Placement and User Flow:** Where in the existing portfolio information architecture (`Orientation`, `About`, `Contact`, header/footer, or another surface) a CV download belongs without disrupting existing Stage 04–08 design foundations.
2. **Document Structure and Professional Presentation:** What sections, evidence framing, typography, and layout standards align the CV with the portfolio's evidence-over-assertion ethos.
3. **Format Strategy (`PDF` vs. `.docx` vs. Both):** Whether both PDF and Microsoft Word `.docx` formats should be provided, considering recruiter/ATS compatibility, layout fidelity, file size, and user expectations.
4. **Content Maintenance and Single Source of Truth:** How CV content will be authored, versioned, and kept synchronized with the live portfolio without creating drift or manual duplication errors.
5. **Visitor Accessibility and Delivery Mechanics:** How downloadable files will be served (static asset hosting on Cloudflare Worker vs. generated/served routes), keyboard/screen-reader link semantics, mobile download behavior, and filename/metadata conventions.
6. **Privacy and Information-Disclosure Considerations:** What personal contact details (e.g., email, phone number, residential location, links) are appropriate for public unauthenticated download versus gated/contact-form inquiry.

---

## 4. Tracking and Journal Control

- **Research Journal Status:** Not yet created (`journal/P1-PORTFOLIO-ENHANCEMENT-RESEARCH.md` will be created only when active research sessions formally begin under project owner authorization).
- **Relationship to Stage 10:** Stage 10 remains `ON HOLD` until the project owner explicitly authorizes its resumption; work under this research charter must not close, overwrite, or erase Stage 10 records.
