# Contact Backend & Message Delivery Specification

**Project:** Professional Engineering Portfolio (Project 01)  
**Document ID:** `DOCS-CONTACT-BACKEND-SPEC`  
**Location:** `docs/CONTACT-BACKEND-SPECIFICATION.md`  
**Status:** Architecture Specification (Final Verified Revision) — Awaiting Owner Approval  
**Operating Boundary:** Specification only. No application code, database migrations, or infrastructure mutations are authorized by this document.

---

## 1. Context & Purpose

This document establishes the technical, architectural, and operational specification for the custom Contact backend of the engineering portfolio.

The portfolio previously evaluated a third-party form delivery mechanism before deciding on an owned, decoupled architecture built with **Python, Django, Django REST Framework, and MySQL Community Server 8.4 LTS**. This backend provides persistent message storage, delivery tracking, and owner notification while maintaining strict decoupling from the existing Vue 3 client.

---

## 2. Approved System Architecture

```
+-------------------------------------------------------------+
|                      VISITOR BROWSER                        |
|                                                             |
|   +-----------------------------------------------------+   |
|   |         Vue 3 Client (app/src/views/ContactView)    |   |
|   |  - Controlled inputs (name, email, message)         |   |
|   |  - Client-side validation & accessible state         |   |
|   |  - Anti-spam honeypot field ("website")             |   |
|   +--------------------------+--------------------------+   |
+------------------------------|------------------------------+
                               |
                               | HTTPS POST /api/contact/
                               | JSON Payload: { name, email, message, website }
                               v
+-------------------------------------------------------------+
|                     APPLICATION BACKEND                     |
|                                                             |
|   +-----------------------------------------------------+   |
|   |       Django REST Framework API (backend/)          |   |
|   |  - Origin validation (django-cors-headers)          |   |
|   |  - Serializer validation & header sanitization      |   |
|   |  - Honeypot enforcement (rejects bot spam with 400) |   |
|   |  - Duplicate-suppression heuristic (60s SHA-256)    |   |
|   |  - Rate limiting (AnonRateThrottle)                 |   |
|   +--------------------------+--------------------------+   |
|                              |                              |
|                              | Step 1: Commit Record First  |
|                              | django.db.backends.mysql     |
|                              | (mysqlclient 2.3.0)          |
|                              v                              |
|   +-----------------------------------------------------+   |
|   |         MySQL 8.4.11 LTS (127.0.0.1:3306)           |   |
|   |  - Dedicated DB: portfolio_db                       |   |
|   |  - Restricted user: portfolio_user                  |   |
|   |  - Primary persistence: ContactMessage committed    |   |
|   +--------------------------+--------------------------+   |
|                              |                              |
|                              | Step 2: Attempt Dispatch     |
|                              | (Record committed in MySQL)  |
|                              v                              |
|   +-----------------------------------------------------+   |
|   |             Notification Dispatcher                 |   |
|   |  - Synchronous attempt with strict short timeout    |   |
|   |  - Updates delivery_status (pending/sent/failed)    |   |
|   |  - Tracks attempts & diagnostic error in MySQL      |   |
|   |  - Bounded best-effort delivery (max 4 attempts)    |   |
|   +--------------------------+--------------------------+   |
+------------------------------|------------------------------+
                               |
                               | Step 3: Outbound Notification
                               | HTTPS API / SMTP
                               v
+-------------------------------------------------------------+
|                EXTERNAL EMAIL SERVICE PROVIDER              |
|              (Provider Selection To Be Decided)             |
|                                                             |
|      Recipient: abdullahiadnan550@gmail.com (Server-only)   |
+-------------------------------------------------------------+
```

### Architectural Principles

1. **Independent Lifecycle & Decoupling**:
   - The frontend (`app/`) is a client-side single-page application built with Vue 3, Vite, and TypeScript.
   - The backend (`backend/`) is a Python/Django service running in an isolated virtual environment (`backend/.venv`).
   - Frontend and backend have independent dependency manifests (`app/package.json` vs. `backend/requirements.txt`), independent test suites, and independent execution environments.
   - The only contract between them is the versioned HTTP REST interface (`POST /api/contact/`).
2. **Environment-Based Configuration**:
   - All secret keys, database credentials, allowed hosts, CORS origins, and email provider tokens are loaded from `backend/.env` using `python-dotenv`.
   - The `.env` file is excluded from version control via `.gitignore`.
3. **Loopback Infrastructure**:
   - MySQL 8.4.11 binds strictly to `127.0.0.1` on port `3306`.
   - The MySQL X Protocol is disabled (`mysqlx=0`).
   - The database server is completely inaccessible from external network interfaces.
4. **Least-Privilege Database Access**:
   - Application queries execute through a dedicated application user (`portfolio_user` at `127.0.0.1`) rather than the MySQL `root` account.
   - Privileges are strictly limited to necessary data manipulation (`SELECT`, `INSERT`, `UPDATE`).

---

## 3. Approved Contact-Form Behavior & Visitor Experience

### 3.1 Content & Presentation

- **Page Title / Main Heading**: `Contact`
- **Introduction Copy**:  
  `Have an idea, a technical problem worth exploring, or an engineering opportunity? Send a message below, and let's start a conversation.`
- **Required Fields**:
  1. `Name` (Sender's name)
  2. `Email` (Sender's return email address)
  3. `Message` (Sender's message content)
- **Submit Action Label**: `Send Message`
- **Owner Notification Recipient**: `abdullahiadnan550@gmail.com`  
  *Crucial Rule*: This address is strictly configured in the backend environment. It is never exposed in frontend components, client-side bundles, or API request/response payloads.

### 3.2 State Progression & Interaction Rules

1. **Initial / Idle State**:
   - The form renders the three accessible inputs and the active `Send Message` button.
2. **Submitting State**:
   - Upon form activation, client-side validation runs.
   - If valid, the submit button transitions to a disabled loading state (`Submitting...` / loading indicator).
   - Input controls remain temporarily disabled or locked to prevent concurrent edits during submission.
   - Duplicate-submission prevention: Multiple clicks or rapid repeat submissions are blocked in the UI.
3. **Confirmed Success State**:
   - Displayed **if and only if** the backend confirms persistent storage in MySQL (HTTP `201 Created`).
   - The input form is replaced by the approved confirmation text:  
     `Message received. Thank you for reaching out — I will review your message and reply via email soon.`
   - A follow-up action is presented: `Send another message`. Activating this action resets the view, restores an empty form, and resets submission state.
   - **Semantic Precision**: The visitor is informed of message receipt by the portfolio system, **not** that an email was delivered to the engineer. The system must never claim that an email was dispatched or delivered merely because the message was successfully stored.
4. **Failure State (Persistence Failure / Network Outage)**:
   - If MySQL persistence fails or the network connection drops (HTTP `500`, `503`, or network error):
     - **No Receipt Issued**: The system strictly does not report successful receipt.
     - **Form Preservation**: All entered text in `Name`, `Email`, and `Message` is strictly preserved in the inputs. The form is never cleared on persistence failure.
     - **Feedback**: A clear, accessible error notice is presented indicating that message persistence could not be completed at this time, inviting the visitor to retry or contact the engineer directly.
     - **Recovery**: The submit button is re-enabled for another attempt.
5. **Accessibility Standards**:
   - Explicit `<label>` elements tied to inputs via `for`/`id`.
   - Input validation feedback linked via `aria-describedby` and `aria-invalid`.
   - Live regions (`aria-live="polite"`) for status transitions (loading, error, success) so assistive technologies announce outcomes immediately.
6. **Data Minimization & Anti-Spam (Honeypot)**:
   - The client collects only Name, Email, and Message.
   - An invisible honeypot field (`website`) is included in the DOM, hidden visually and from assistive technology (`aria-hidden="true"`, off-screen positioning, `tabindex="-1"`, `autocomplete="off"`).
   - If populated, the backend classifies the request as automated bot spam, immediately rejects the submission with HTTP `400 Bad Request`, and writes zero rows to MySQL.

---

## 4. Critical Delivery Architecture: Option A (Database-First)

### 4.1 Decision Overview & Core Delivery Philosophy

**Approved Decision**: **Option A — Database-First Persistence with Decoupled Notification**.

Under Option A:
- The system of record is the local MySQL database.
- Primary operation completion occurs when the contact message is committed to MySQL.
- **Message receipt** (capturing and persistently securing the visitor's communication) is strictly decoupled from **email notification delivery** (downstream alert to the portfolio owner).

#### The Three Distinct API & Operational Outcomes

The backend formally defines and distinguishes three mutually exclusive execution paths:

| Outcome | Database Persistence | Email Notification Attempt | HTTP Status Returned | Visitor-Facing Result | Backend System State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Persistence Failure** | **Failed** (transaction aborted / connection down) | **Not Attempted** (aborted before dispatch) | `500 Internal Server Error` | **No receipt issued.** Error message displayed; all form inputs preserved on client for retry. | No row in `ContactMessage`. No orphan email sent. Error logged in server diagnostics. |
| **2. Persistence Success, Notification Failure** | **Succeeded** (committed to MySQL) | **Failed** (provider timeout, network drop, API error) | `201 Created` | **Receipt confirmed.** Approved confirmation text displayed (`"Message received..."`). | Record safely preserved in MySQL. `delivery_status = 'failed'`, `delivery_attempts = 1`, `delivery_error` logged. Eligible for operator retry once tooling is implemented. |
| **3. Persistence Success, Notification Success** | **Succeeded** (committed to MySQL) | **Succeeded** (provider confirmed acceptance) | `201 Created` | **Receipt confirmed.** Identical approved confirmation text displayed (`"Message received..."`). | Record safely preserved in MySQL. `delivery_status = 'sent'`, `delivery_attempts = 1`, `last_attempt_at` timestamped. |

#### Architectural Guarantees Across Outcomes

1. **Receipt Validity**: In both Outcome 2 and Outcome 3, the visitor receives the exact same confirmation of receipt (`"Message received..."`) because their message is genuinely preserved in the portfolio's persistent storage.
2. **No False Delivery Claims**: The visitor is never told that an email notification was delivered, nor are they burdened with internal email delivery failures when their message has been safely recorded.
3. **No False Receipt Claims**: In Outcome 1, the visitor is never told their message was received when database storage failed.

---

### 4.2 Formal Delivery State Machine & State Definitions

Every stored message progresses through an explicit state machine:

```
[ Visitor Submission ]
         |
         v
+------------------+     Commit Fails
| MySQL Insert     | -------------------> HTTP 500 (No receipt; form preserved)
+--------+---------+
         |
         | Commit Succeeded (ContactMessage row committed)
         v
+------------------+
| State: PENDING   |
+--------+---------+
         |
         | Dispatch Notification Attempt (Synchronous, short timeout)
         |
         +---------------------------------------+
         |                                       |
         | Provider Accepts                      | Provider Rejects / Times Out /
         v                                       | Interrupted Network Connection
+------------------+                             v
| State: SENT      |                   +------------------+
+------------------+                   | State: FAILED    |
(HTTP 201 to visitor)                  +--------+---------+
                                       (HTTP 201 to visitor;
                                        Message preserved in MySQL)
                                                 |
                                                 | Future Operator Retry
                                                 | (Requires separately implemented tooling;
                                                 | Bounded by MAX_TOTAL_ATTEMPTS)
                                                 v
                                       +------------------+
                                       | Re-attempt       |
                                       +------------------+
```

#### State Definitions & Lifecycle Meaning

1. `pending`:
   - **Definition**: The message has been committed to MySQL and safely persisted. Outbound notification dispatch has not yet completed.
   - **Lifecycle Positions**:
     a. *Initial In-Flight*: The record has just been inserted and committed in Step 1, and the initial synchronous notification dispatch in Step 2 is currently executing.
     b. *Interrupted / Crash State*: The message was safely committed to MySQL, but the application process abruptly terminated, crashed, or was killed before notification dispatch finished or before the outcome could be recorded in MySQL.
     c. *Initial Crash Safety & Tooling Boundary*: Because Option A commits the transaction in MySQL before notification dispatch, the visitor's message is never lost. In the initial version, a message committed to MySQL before a process crash remains safely stored with `delivery_status = 'pending'`. The initial version contains no automated recovery or retry scheduler; pending notifications are not automatically recovered or retried. Instead, operator-initiated recovery of such interrupted pending messages becomes available only after the separately specified Phase 2 retry tooling is implemented and explicitly authorized.
2. `sent`:
   - **Definition**: The external email delivery provider returned an affirmative confirmation (e.g. HTTP 200/202 with provider message ID, or SMTP 250 OK) that it accepted the email payload for delivery.
   - **Precision Boundary**: Represents **affirmative provider acceptance** only. The system does not claim guaranteed recipient inbox placement, as downstream spam filtering or MTA routing is outside the portfolio's operational boundary.
3. `failed`:
   - **Definition**: An outbound notification attempt encountered an error: network disconnection, connection reset, socket timeout, or provider HTTP 4xx/5xx rejection.
   - **Persistence Invariant**: The message content remains completely intact and immutable in MySQL.
   - **Retry Eligibility**: The record is eligible for operator retry provided cumulative attempts have not reached the total attempt ceiling (`delivery_attempts < MAX_TOTAL_ATTEMPTS`).

---

### 4.3 Delivery & Persistence Guarantees: Realistic Semantics

#### 1. Network Disconnection, Timeouts, and Asymmetric Uncertainty
When the Django backend dispatches an outbound notification over HTTPS or SMTP:
- If a socket timeout, connection reset, or abrupt network failure occurs while waiting for the provider's response, the outcome is fundamentally uncertain:
  - *Scenario A*: The provider never received the payload (timeout during initial TCP/TLS handshake or request transmission). No email was dispatched.
  - *Scenario B*: The provider received, accepted, and queued the email, but the response was dropped or delayed by intermediate network hops. The email was accepted by the provider, but Django timed out before receiving the acknowledgment.
- In Scenario B, Django must classify the attempt as `failed` because it cannot verify provider acceptance.
- If an operator subsequently retries this `failed` record, the provider will be asked to dispatch the email again, which can result in duplicate notification emails to the owner.

#### 2. Bounded Best-Effort Notification Delivery (Not Unconditional At-Least-Once)
- **Bounded Attempts**: Notification delivery is **best-effort**, bounded strictly to **one initial attempt plus up to three retries** ($\text{MAX\_TOTAL\_ATTEMPTS} = 4$).
- **No Delivery Guarantee**: Four attempts do **not** guarantee eventual provider acceptance or inbox delivery (e.g., if external network outages persist, credentials fail, or provider account limits are reached).
- **Potential Duplicates**: Because network partitions can drop provider confirmations, retrying after an uncertain timeout may result in duplicate notification emails to the owner.
- **Provider Acceptance vs. Inbox Delivery**: The `sent` status strictly confirms that the external provider **accepted** the dispatch payload. It does not guarantee or verify that the email reached the recipient's inbox.
- **No Unverified Exactly-Once Claims**: The system must **never** claim exactly-once email delivery unless and until a concrete, provider-specific idempotency mechanism (such as API idempotency keys, e.g., Postmark `X-Entity-Ref-ID` or unique client-generated `Message-ID` headers supported by the selected provider) is formally established and verified.

#### 3. Database Persistence & Duplicate-Suppression Heuristic
- **No Absolute Exactly-Once Claim**: Database persistence must **not** be characterized as "strictly exactly-once" based solely on non-sequential UUID primary keys and an application-level hash check.
- **Duplicate-Suppression Heuristic**: The 60-second SHA-256 content-hash window is an operational **heuristic** designed to mitigate rapid accidental double-clicks and client-side retry bursts.
- **Concurrency & Race Conditions**: In a concurrent environment (e.g., multiple WSGI/ASGI worker threads or processes handling simultaneous requests arriving within milliseconds), an application-level check can suffer from race conditions. True duplicate prevention across concurrent requests requires database constraints (such as unique constraints or time-bucketed indices) and transaction-safe handling.
- **Legitimate Submission Trade-Off**: Under this 60-second suppression heuristic, an intentional, legitimate repeat submission with identical name, email, and message sent within the window will be treated as a duplicate and will not generate a second database record.
- **Unresolved Idempotency Mechanism**: The formal design of database-level concurrency constraints (e.g., unique constraint on content hash over a sliding time bucket vs. database table locking vs. caching deduplication keys) is explicitly deferred to implementation planning.

---

### 4.4 Notification Failure Invariants

If notification delivery fails *after* successful database persistence:

1. **Visitor Integrity**:
   - The visitor must **never** be told that their message was lost.
   - The visitor has already received the receipt confirmation because their message is genuinely preserved in MySQL.
   - The visitor must **never** be told that an email was delivered to the engineer.
2. **Database Non-Erasure**:
   - A failed notification attempt must **never** roll back, delete, or hide the saved `ContactMessage` row.
   - The message content (`name`, `email`, `message`, `created_at`) is immutable.
3. **Audit Logging & Error Recording**:
   - The record status updates from `pending` to `failed`.
   - `delivery_attempts` is incremented.
   - `last_attempt_at` is timestamped.
   - A sanitized diagnostic error message or HTTP status code is recorded in `delivery_error`.

---

### 4.5 Failure of Persistence Invariant

If MySQL persistence fails (e.g. database service stopped, network socket error, integrity failure):
- The API **must not** return a successful receipt response.
- The API returns HTTP `500 Internal Server Error`.
- Zero outbound email notification calls are initiated.
- The visitor's browser retains all form inputs (`name`, `email`, `message`) and displays an accessible retry prompt.

---

### 4.6 Initial Notification & Operator Retry Strategy

To ensure high reliability while maintaining a practical, lightweight initial footprint, the notification system uses a two-phase architecture that **does not require an always-on background queue worker (such as Celery + Redis)** in the initial implementation.

#### Phase 1: Request-Lifecycle Notification with Persistent Tracking

1. **Sequential Execution Order**:
   - **Step 1 (Validate)**: Validate submitted payload against schema and honeypot rules.
   - **Step 2 (Persist First)**: Write and commit the `ContactMessage` record to MySQL with `delivery_status = 'pending'`, `delivery_attempts = 0`, and `created_at = NOW()`. The database transaction is fully committed before any network socket is opened.
   - **Step 3 (Attempt Notification)**: With the record safely committed in MySQL, execute the outbound notification call with a strict, short timeout (e.g., 3.0 seconds maximum) so the visitor's HTTP connection is not delayed.
   - **Step 4 (Record Outcome)**:
     - If the provider confirms acceptance: Update the row in place to `delivery_status = 'sent'`, `delivery_attempts = 1`, and `last_attempt_at = NOW()`.
     - If the provider times out, drops the connection, or errors: Update the row in place to `delivery_status = 'failed'`, `delivery_attempts = 1`, `last_attempt_at = NOW()`, and `delivery_error = '<sanitized diagnostic>'`.
   - **Step 5 (Return Response)**: Return HTTP `201 Created` with the confirmed receipt text.
2. **Separation of Persistence and Notification Status**:
   - Message persistence status is binary: the record exists in MySQL (`id`, `created_at`).
   - Notification status is tracked in independent columns (`delivery_status`, `delivery_attempts`, `last_attempt_at`, `delivery_error`).
   - A notification failure modifies only the tracking columns; the message body and sender details remain immutable.

#### Phase 2: Operator-Initiated Retry Specification (Future Implementation)

For messages that enter the `failed` state (or remain in an interrupted `pending` state), an authorized operator will be able to trigger notification retries in a later implementation under strict safeguards:

1. **Attempt Counting & Standardized Terminology**:
   - `delivery_attempts`: Cumulative count of all delivery attempts made (initial attempt sets `1`; each retry increments by `1`).
   - `MAX_RETRIES = 3`: Explicitly defined as **three retries after the initial delivery attempt**.
   - `MAX_TOTAL_ATTEMPTS = 4`: The absolute ceiling on total delivery attempts:
     $$\text{MAX\_TOTAL\_ATTEMPTS} = 1\text{ (initial attempt)} + \text{MAX\_RETRIES (3)} = 4\text{ total attempts}$$
   - *Terminology Standard*: The specification consistently distinguishes:
     * **Initial attempt**: The single attempt executed during the HTTP request lifecycle (attempt 1).
     * **Retry**: Subsequent operational attempts to deliver a failed or interrupted notification (attempts 2, 3, and 4).
     * **Total attempts**: The cumulative count of all attempts (`delivery_attempts`), strictly capped at `MAX_TOTAL_ATTEMPTS = 4`.

2. **Selection Criteria**:
   A retry operation targets records strictly matching:
   ```sql
   SELECT * FROM contact_message
   WHERE delivery_status IN ('pending', 'failed')
     AND delivery_attempts < :MAX_TOTAL_ATTEMPTS -- where MAX_TOTAL_ATTEMPTS = 4 (1 initial + 3 retries)
     AND (last_attempt_at IS NULL OR last_attempt_at < NOW() - INTERVAL 15 MINUTE);
   ```
   *Note on `pending` records*: In the initial version, records where persistence succeeded but the process crashed before notification completion remain safely stored in MySQL with `delivery_status = 'pending'` and `last_attempt_at IS NULL`. These pending notifications are not automatically recovered or dispatched in the initial version. Operator-initiated recovery of these records becomes available only when this Phase 2 retry tooling is implemented and authorized for execution by an operator.

3. **Concurrency & Duplicate Prevention**:
   - **No Duplicate Records**: Retries operate strictly on existing primary keys (`id`). A retry must never insert a new `ContactMessage` row.
   - **Row Locking**: The retry runner uses row-level locking (`SELECT ... FOR UPDATE`) inside an atomic transaction before attempting outbound dispatch. This prevents concurrent retry runners or multiple workers from sending duplicate notification emails for the same message.

4. **Uncontrolled Loop Prevention (Attempt Ceiling)**:
   - Each attempt increments `delivery_attempts`.
   - When `delivery_attempts >= MAX_TOTAL_ATTEMPTS` (i.e., after 4 total attempts: 1 initial attempt and 3 retries), the message remains permanently in `failed` state with `delivery_error = 'Maximum delivery attempts (4) reached (1 initial + 3 retries); requires operator intervention'`. Automated retries will not process the record again.

5. **Implementation Boundary & Tooling Availability**:
   - **Explicit Boundary**: No retry command, endpoint, scheduler, or background worker is implemented in the initial version.
   - **Initial Version Reality**: In the initial version, a message committed to MySQL before a process crash remains safely stored with `delivery_status = 'pending'`, but no automated recovery or retry takes place.
   - **Operator Tooling Prerequisite**: Operator-initiated recovery becomes available only after the separately specified Phase 2 retry tooling is implemented and explicitly authorized by the project authority. Phase 1 provides the underlying data model, status invariants, and persistence guarantees that allow such tooling to be introduced safely in the future without schema changes.

---

## 5. API Contract: `POST /api/contact/`

### 5.1 Request Definition

- **Method**: `POST`
- **Path**: `/api/contact/`
- **Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```

#### Request JSON Schema

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "Full name or preferred name of the sender"
    },
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 254,
      "description": "Return email address of the sender"
    },
    "message": {
      "type": "string",
      "minLength": 1,
      "maxLength": 5000,
      "description": "Message inquiry content"
    },
    "website": {
      "type": "string",
      "maxLength": 100,
      "description": "Anti-spam honeypot field. Must be omitted or empty in legitimate human submissions."
    }
  },
  "required": ["name", "email", "message"],
  "additionalProperties": false
}
```

---

### 5.2 Field Validation & Sanitization Rules

1. `name`:
   - Stripped of leading/trailing whitespace.
   - Rejects carriage returns (`\r`) and line feeds (`\n`) to prevent HTTP/email header injection.
   - Min length: 1 character. Max length: 100 characters.
2. `email`:
   - Stripped of leading/trailing whitespace and normalized to lowercase.
   - Strictly validated against RFC 5322 email syntax via Django's `EmailValidator`.
   - Single-line string only (no line breaks).
   - Max length: 254 characters (RFC 5321 standard).
3. `message`:
   - Stripped of leading/trailing whitespace.
   - Min length: 1 character. Max length: 5000 characters.
   - Retains internal newlines for readability.
4. `website` (Honeypot):
   - Hidden visually and from assistive technology in the frontend.
   - **Enforcement Rule**: If present and non-empty, the request is immediately rejected with HTTP `400 Bad Request`.
   - **Database Action**: No row is inserted into MySQL (`ContactMessage`).
   - **Notification Action**: No outbound notification is dispatched.
   - **Response Action**: No receipt or confirmation of receipt is returned.
   - **Architectural & Security Rationale**:
     - *Semantic Integrity*: Preserves the foundational rule that HTTP `201 Created` and the receipt confirmation text are issued **only** when a legitimate message is committed to MySQL. Returning a synthetic `201` would falsely claim receipt of a message that was discarded, violating API truthfulness and contaminating operational metrics.
     - *Spam Protection*: Automated bots scraping forms do not analyze generic `400 Bad Request` JSON error structures. Immediate rejection terminates processing at the serializer boundary with zero database I/O and zero network overhead.

---

### 5.3 Response Definitions

#### 1. Success Response (Confirmed Persistence)
- **Status**: `201 Created`
- **Condition**: Returned when the message is committed to MySQL (Outcomes 2 & 3).
- **Headers**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "status": "success",
    "message": "Message received. Thank you for reaching out — I will review your message and reply via email soon.",
    "id": "e4b5a2f8-9a3d-4c8e-b123-456789abcdef"
  }
  ```
- **Semantic Note**: Confirms message receipt by the portfolio system. Does not claim email delivery.

#### 2. Validation Error Response
- **Status**: `400 Bad Request`
- **Condition**: Missing required fields, invalid email format, or message length exceeded.
- **Headers**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "status": "error",
    "errors": {
      "name": ["This field may not be blank."],
      "email": ["Enter a valid email address."],
      "message": ["Ensure this field has no more than 5000 characters."]
    }
  }
  ```

#### 3. Honeypot Rejection Response
- **Status**: `400 Bad Request`
- **Condition**: Honeypot field `website` is populated.
- **Headers**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "status": "error",
    "message": "Invalid submission."
  }
  ```

#### 4. Persistence Failure / Internal Error Response
- **Status**: `500 Internal Server Error`
- **Condition**: MySQL connection error, transaction rollback, or server crash (Outcome 1).
- **Headers**: `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "status": "error",
    "message": "Unable to save your message at this time. Please try again shortly."
  }
  ```
- **Frontend Action**: Displays error notice; strictly preserves visitor input values in the form.

#### 5. Rate Limit Exceeded Response
- **Status**: `429 Too Many Requests`
- **Condition**: Client IP exceeds anonymous throttle limit.
- **Headers**: `Content-Type: application/json`, `Retry-After: 60`
- **Payload**:
  ```json
  {
    "status": "error",
    "message": "Submission rate limit exceeded. Please wait a few moments before trying again."
  }
  ```

---

### 5.4 Duplicate-Submission Handling

- **Client-Side Prevention**:
  The submit button is immediately disabled upon activation until a response is received or a network timeout occurs to mitigate accidental repeat clicks.
- **Server-Side Duplicate-Suppression Heuristic**:
  To reduce duplicate database entries caused by client re-transmissions or double-clicks:
  The view computes a SHA-256 fingerprint of `(normalized_email, message_content)` and checks if a record with an identical fingerprint was created within the last 60 seconds.
  - *Heuristic Action*: If an existing record within the 60-second window is detected, the backend returns HTTP `200 OK` or `201 Created` with the confirmed receipt text without inserting an additional database row.
  - *Trade-Off Acknowledgment*: A visitor who intentionally submits identical message content within 60 seconds will have their subsequent submission treated as a duplicate and suppressed.
  - *Concurrency Limitation & Database Constraints*: This application-level query is a heuristic; concurrent requests arriving simultaneously across multiple worker threads or processes can race past this check. Preventing duplicate rows under high concurrency requires transaction-safe handling and database-level constraints.
  - *Unresolved Decision*: The concrete database concurrency mechanism (e.g., unique database constraint with time-bucketed key, row locking, or atomic cache lock) is explicitly marked as an unresolved technical choice to be finalized during backend implementation.

---

### 5.5 CORS Configuration

- **Development Origin**:  
  `http://localhost:5173` (Vite development server for the Vue client).
- **Production Origin**:  
  Must be explicitly declared in `backend/.env` under `CORS_ALLOWED_ORIGINS` (e.g. `https://adnanabdullahi.com`).  
  *Rule*: Wildcard `CORS_ALLOW_ALL_ORIGINS = True` is strictly prohibited. Production origins will be specified when the hosting target is finalized.

---

## 6. Proposed Data Model: `ContactMessage`

The database schema represents the minimum record necessary for message fidelity, delivery tracking, and follow-up without hoarding unnecessary personal data.

### 6.1 Field Specifications

| Field Name | Django Model Type | Constraints & Defaults | Purpose |
| :--- | :--- | :--- | :--- |
| `id` | `UUIDField` | `primary_key=True`, `default=uuid.uuid4`, `editable=False` | Non-sequential, collision-resistant unique identifier. |
| `name` | `CharField` | `max_length=100` | Sender's submitted name. |
| `email` | `EmailField` | `max_length=254`, `db_index=True` | Sender's validated return email address. |
| `message` | `TextField` | `max_length=5000` | In-depth message content. |
| `created_at` | `DateTimeField` | `auto_now_add=True`, `db_index=True` | Timestamp of confirmed database persistence. |
| `delivery_status` | `CharField` | `max_length=20`, `choices=STATUS_CHOICES`, `default='pending'`, `db_index=True` | Tracks notification state (`pending`, `sent`, `failed`). |
| `delivery_attempts` | `PositiveSmallIntegerField` | `default=0` | Cumulative count of all delivery attempts made (initial attempt sets `1`; each retry increments by `1`). |
| `last_attempt_at` | `DateTimeField` | `null=True`, `blank=True` | Timestamp of the most recent notification dispatch attempt. |
| `delivery_error` | `TextField` | `blank=True`, `null=True` | Diagnostic error message/status code from provider on failure. |
| `content_hash` | `CharField` | `max_length=64`, `db_index=True` | SHA-256 hash of `email + message` used for 60-second duplicate suppression heuristic. |

### 6.2 Indexing Strategy

1. `created_at` (B-tree): For sorting messages chronologically in administration tools.
2. `delivery_status` (B-tree): For fast querying of messages needing delivery or retry (`pending`, `failed`).
3. `content_hash` + `created_at` (Composite): For rapid duplicate submission lookup within the 60-second heuristic window.

### 6.3 Database Security & Isolation

- **Database Name**: `portfolio_db`
- **Application User**: `'portfolio_user'@'127.0.0.1'`
- **Authentication**: `caching_sha2_password`
- **Privilege Separation**:
  - The application user will only be granted:
    `GRANT SELECT, INSERT, UPDATE ON portfolio_db.* TO 'portfolio_user'@'127.0.0.1';`
  - Structural migrations (`CREATE`, `ALTER`, `DROP`) can be executed either via temporary elevated grant or a dedicated migration user.
  - The MySQL `root` account is strictly prohibited in `settings.py` or `backend/.env`.

---

## 7. Security & Verification Requirements

### 7.1 Security Safeguards

1. **Header Injection Prevention**:  
   Newline characters (`\r`, `\n`) in the `name` or `email` fields are stripped or rejected to prevent SMTP/HTTP header injection.
2. **Denial of Service / Spam Mitigation**:  
   - Maximum body length enforced at 5000 characters.
   - Rate limiting via Django REST Framework `AnonRateThrottle` (e.g. max 5 submissions per 10 minutes per client IP).
   - Honeypot rejection returning HTTP `400 Bad Request` without database insertion.
3. **Secret Hygiene**:  
   Database passwords, email provider API keys, and Django's `SECRET_KEY` are stored exclusively in `backend/.env`. Zero secrets exist in source code, client builds, or Git commits.
4. **Data Protection & Minimization**:  
   No tracking cookies, marketing pixels, or extraneous telemetry data are attached to the contact message.

---

### 7.2 Testing Strategy

Before approving deployment, the backend must satisfy a dedicated test suite in `backend/tests/`:

1. **Validation Tests**:
   - `test_valid_submission`: Confirms HTTP 201 and record creation in MySQL.
   - `test_missing_required_fields`: Confirms HTTP 400 for missing name, email, or message.
   - `test_invalid_email_format`: Confirms HTTP 400 for malformed emails.
   - `test_message_length_exceeded`: Confirms HTTP 400 when message > 5000 chars.
   - `test_honeypot_triggered_rejects_with_400`: Confirms that a populated honeypot returns HTTP 400 and writes zero records to `ContactMessage`.
2. **Option A Persistence & Delivery Semantics Tests**:
   - `test_outcome_1_persistence_failure_returns_500`: Simulates database unavailability, asserting HTTP 500, no receipt confirmation returned, no notification dispatched, and visitor inputs preserved.
   - `test_outcome_2_persistence_success_notification_failure_returns_201`: Mocks notification provider failure after database commit, asserting HTTP 201 returned to visitor, record status set to `failed`, `delivery_attempts` set to 1, and `delivery_error` diagnostic logged in MySQL. Acknowledges notification failure does not invalidate database persistence.
   - `test_outcome_3_persistence_success_notification_success_returns_201`: Mocks successful notification provider response, asserting HTTP 201 returned to visitor, record status set to `sent`, and `delivery_attempts` set to 1.
3. **Delivery State Consistency & Retry Safety Tests**:
   - `test_interrupted_process_leaves_pending_state_stored_safely`: Simulates application shutdown after database commit but prior to dispatch completion, verifying that the record remains safely stored in MySQL with `delivery_status = 'pending'` and `last_attempt_at = NULL`, confirming that message persistence survives process termination even prior to the implementation of retry tooling.
   - `test_uncertain_delivery_timeout_recorded_as_failed_preserves_record`: Simulates network socket timeout waiting for provider acknowledgment, asserting status transitions to `failed`, `delivery_attempts` is 1, diagnostic details are recorded, and message body remains intact in MySQL. Verifies that retries may send duplicate emails if provider accepted before timeout.
   - `test_retry_updates_record_in_place_without_duplication`: Asserts that retrying a `failed` record updates the existing row and does not insert a new row.
   - `test_retry_respects_max_total_attempts_ceiling`: Asserts that records reaching `MAX_TOTAL_ATTEMPTS = 4` (1 initial + 3 retries) are not repeatedly dispatched, demonstrating bounded best-effort delivery.
4. **Duplicate Suppression Tests**:
   - `test_duplicate_suppression_heuristic`: Verifies that identical submissions within the 60-second heuristic window do not duplicate database rows, and asserts the documented trade-off.
5. **Portfolio Regression Verification**:
   - Verify that all existing Vue unit tests (`tests/unit/`) and Playwright E2E tests (`tests/e2e/`) continue to pass completely untouched.

---

## 8. Categorization of Decisions

To ensure engineering clarity, decisions are explicitly categorized by authority and status:

### 8.1 Confirmed / Approved Decisions
- **Architecture**: Decoupled Vue 3 frontend (`app/`) + Django REST Framework backend (`backend/`) + MySQL 8.4 LTS + `mysqlclient`.
- **Delivery Strategy & Option A Invariants**: Database-first persistence; receipt confirmed upon MySQL commit; notification handled as separate operation.
  - Notification delivery is **best-effort**, bounded to **one initial attempt plus up to three retries** ($\text{MAX\_TOTAL\_ATTEMPTS} = 4$).
  - Four attempts do **not** guarantee eventual provider acceptance or inbox delivery.
  - Network timeouts create uncertain delivery outcomes that may result in duplicate email notifications if provider acceptance occurred before timeout.
  - The `sent` status strictly confirms affirmative provider acceptance, not verified recipient inbox delivery.
  - Crash safety is preserved: in the initial version, a message committed to MySQL before a process crash remains safely stored with `delivery_status = 'pending'`. Pending notifications are not automatically recovered or retried in the initial version; operator-initiated recovery becomes available only after the separately specified retry tooling is implemented and authorized.
- **Three API Outcomes**: Explicit definitions for persistence failure (500), persistence success + notification failure (201 with DB tracking), and persistence success + notification success (201).
- **Honeypot Rejection**: Honeypot (`website`) populated requests return HTTP `400 Bad Request`, write zero database records, trigger zero notifications, and issue no receipt.
- **Initial Notification Execution**: Serial request-lifecycle dispatch with strict timeout, eliminating background queue daemon requirements in Phase 1.
- **Attempt Counting & Terminology**: `MAX_RETRIES = 3` defined as 3 retries after the initial attempt (`MAX_TOTAL_ATTEMPTS = 4`). Standardized terminology across initial attempt, retries, and total attempts.
- **State Consistency & Recovery Tooling Boundary**: Formal state definitions for `pending`, `sent`, and `failed`. If the application stops abruptly after MySQL commit, the message remains safely in `pending`. The initial version does not provide automatic recovery; operator-initiated recovery is available only after separate implementation and authorization of Phase 2 retry tooling.
- **Operator Retry Model**: Controlled in-place row update targeting `failed`/`pending` records, bounded by `MAX_TOTAL_ATTEMPTS = 4`, with row-locking concurrency guards.
- **Visitor Experience**: Exact headings, introduction copy, required fields, success copy, input preservation on error, and hidden recipient address.
- **Credential Storage**: Environment-based secrets via `backend/.env` (excluded from Git).
- **Database Boundary**: Dedicated database `portfolio_db`, least-privilege user `portfolio_user`, loopback binding `127.0.0.1:3306`, MySQL X Protocol disabled.

### 8.2 Proposed Technical Choices
- **API Schema**: Endpoint `POST /api/contact/`, field limits (100 char name, 254 char email, 5000 char message), and structured JSON responses.
- **Model Design**: `ContactMessage` schema with UUID primary key, timestamp indexing, delivery status indexing, and SHA-256 duplicate suppression hash.
- **Duplicate Suppression Heuristic**: 60-second SHA-256 window on `(email, message)`.
- **Proposed Retry Defaults**: `MAX_RETRIES = 3` (for `MAX_TOTAL_ATTEMPTS = 4`) and 15-minute minimum retry cooldown window.

### 8.3 Open Questions & Deferred Decisions (Do Not Assume)
1. **Email Service Provider**: Selection of the specific transaction provider (e.g. Postmark, SendGrid, Amazon SES, Mailgun, or standard SMTP), including evaluation of whether the selected provider supports API idempotency keys.
2. **Database Concurrency & Idempotency Hardening**: The concrete database-level mechanism for preventing duplicate records during highly concurrent requests (e.g., unique database constraint with time-bucketed hashing vs. advisory locks vs. application-level transaction isolation) is explicitly unresolved and deferred to implementation.
3. **Provider-Specific Idempotency Mechanism**: Whether the selected email provider supports idempotency keys (e.g. Postmark `X-Entity-Ref-ID`) to prevent duplicate email dispatches during ambiguous timeouts is explicitly unresolved.
4. **Retry Alerting Mechanism**: Operational alerting mechanism when a record exhausts `MAX_TOTAL_ATTEMPTS = 4` without successful delivery.
5. **Data Retention Policy**: The formal retention period for stored messages in MySQL (e.g., 90 days, 180 days, or indefinite) and the automated purging schedule.
6. **Production Hosting Environment & CORS Origin**: The target production domain, hosting architecture (VPS, container, serverless), and final production CORS allowed origin list.

---

*This specification is complete and frozen for owner review. No application code or database changes will be made until explicit approval is granted.*
