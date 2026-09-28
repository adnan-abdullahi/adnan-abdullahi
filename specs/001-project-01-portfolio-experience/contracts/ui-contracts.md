# UI & State Contracts: Project 01 — Portfolio Experience

**Feature Branch**: `001-project-01-portfolio-experience`  
**Date**: 2026-09-28  
**Spec**: [spec.md](../spec.md)  
**Status**: Complete (Proposed for Human Review)

---

## 1. Scope & Purpose

This contract defines the client-side interface contracts for view rendering, routing, navigation actions, and accessibility attributes. Since the Project 01 portfolio experience is a client-side application with zero external network APIs or backend services, the primary contracts are:

1. **Routing & URL State Contract**: Hash-based URL representations and state synchronization.
2. **View Navigation Actions Contract**: Forward transitions, return actions, and parameters.
3. **Accessibility & Focus Contract**: Landmarks, ARIA roles, and focus shift targets.
4. **Evidence Display Contract**: Component contract for rendering traceable evidence items.

---

## 2. Routing & URL State Contract

The application uses hash routing to ensure static hosting compatibility without server URL rewrites.

| Route Hash              | View Rendered              | Depth Level         | Semantic Role                         |
| ----------------------- | -------------------------- | ------------------- | ------------------------------------- |
| `#/` or `#/orientation` | `PortfolioOrientationView` | `entry`             | Portfolio entry and orientation       |
| `#/project-01`          | `Project01View`            | `project-context`   | Central engineering project hub       |
| `#/approach`            | `EngineeringApproachView`  | `dimension`         | Dimension: Methodology & inquiry      |
| `#/record`              | `EngineeringRecordView`    | `dimension`         | Dimension: Decisions & verifications  |
| `#/deep-engineering`    | `DeepEngineeringView`      | `deeper-inspection` | Deeper inspection: Design foundations |

### Contract Guarantees:

- Unrecognized hashes redirect to `#/project-01` (or `#/orientation` if initial visit).
- Hash changes immediately synchronize the active view component and the active depth indicator.
- Standard browser back/forward buttons seamlessly trigger corresponding state transitions.

---

## 3. View Navigation Actions Contract

Every view component implements a standardized interface for user navigation events.

```typescript
export interface ViewNavigationContract {
  // Forward navigations
  onNavigateToProject01?(): void;
  onNavigateToApproach?(): void;
  onNavigateToRecord?(): void;
  onNavigateToDeepEngineering?(): void;

  // Established return navigations
  onReturnToProject01?(): void;
  onReturnToOrientation?(): void;
}
```

### Action Specifications:

1. **`onNavigateToProject01`**:
   - _Source_: Orientation view action button ("Explore Project 01").
   - _Target_: `#/project-01`.
   - _Focus_: Focus shifted to Project 01 primary heading.
2. **`onNavigateToApproach`**:
   - _Source_: Project 01 dimension card ("Engineering Approach").
   - _Target_: `#/approach`.
   - _Focus_: Focus shifted to Approach primary heading.
3. **`onNavigateToRecord`**:
   - _Source_: Project 01 dimension card ("Engineering Record").
   - _Target_: `#/record`.
   - _Focus_: Focus shifted to Record primary heading.
4. **`onNavigateToDeepEngineering`**:
   - _Source_: Approach view action button or Record view action button ("Inspect Deeper Evidence").
   - _Target_: `#/deep-engineering`.
   - _Focus_: Focus shifted to Deep Engineering primary heading.
5. **`onReturnToProject01`**:
   - _Source_: Deep Engineering return rail ("Return to Project 01"), Approach back button, or Record back button.
   - _Target_: `#/project-01`.
   - _Focus_: Focus shifted to Project 01 container.
6. **`onReturnToOrientation`**:
   - _Source_: Project 01 back button ("Return to Portfolio Orientation").
   - _Target_: `#/orientation`.
   - _Focus_: Focus shifted to Orientation container.

---

## 4. Accessibility & Focus Contract

To satisfy V5 Accessibility Verification and WCAG 2.1 AA standards, every view must expose standard DOM landmarks and attributes.

### View Landmarks:

```html
<header role="banner" class="app-header">
  <nav role="navigation" aria-label="Experience Navigation">
    <div class="depth-indicator" aria-live="polite">
      Current Depth: <span id="current-depth-label">Dimension</span>
    </div>
  </nav>
</header>

<main id="main-content" role="main" tabindex="-1">
  <!-- Active View Injected Here -->
</main>
```

### Focus Contract:

- Upon any route/view change:
  1. The `#main-content` heading `<h1>` receives focus via `.focus()`.
  2. The `aria-live="polite"` region announces: `"Navigated to [View Title]. Inspection depth: [Depth Name]"`.
  3. Screen position smoothly resets to top (`window.scrollTo({ top: 0, behavior: 'auto' })`).

---

## 5. Evidence Item Display Contract

For rendering atomic evidence nodes within Deep Engineering, components must strictly render all elements of the 9-part chain:

```typescript
export interface EvidenceCardProps {
  item: {
    id: string;
    problem: string;
    requirement: string;
    decision: string;
    technicalWork: string;
    evidence: string;
    verification: string;
    outcome: string;
    reflection: string;
    growth: string;
    uncertainty?: string;
  };
}
```

### Rendering Invariants:

- `outcome` MUST be presented as observed verification data, NEVER as an ungrounded or speculative capability claim.
- If `uncertainty` is present, it MUST be rendered visibly with an explicit "Unresolved Question" or "Visible Uncertainty" badge, NEVER hidden or omitted.
- The 9-stage relationship chain MUST be visually represented in sequential logical order.
