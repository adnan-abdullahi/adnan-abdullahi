
# Current Portfolio — Visual Source Registry

**Status:** Human-approved visual source registry  
**Related foundation:** docs/DESIGN-FOUNDATION-CURRENT-PORTFOLIO.md

This registry distinguishes the actual portfolio background asset from the four supplied composed screen references.

---

## Source Set

| ID | Role | Original supplied file | Dimensions | SHA-256 | Intended repository path |
|---|---|---|---:|---|---|
| SOURCE-01 | **Actual portfolio background** | ChatGPT Image Oct 5, 2026, 03_26_56 PM(2).png | 1672 × 941 | 8bfa4d9dd35d1de168cb0f1073d65775e1c463959b0aaa119efa9331e9a97fe9 | app/public/assets/portfolio/cinematic-background.png |
| SOURCE-02 | Home reference | ChatGPT Image Oct 4, 2026, 10_42_38 AM(4).png | 1672 × 941 | d72858524ffc65ffc310a8481e11348e4735022a8557e49f08b6d9070fe5dc72 | docs/design-foundation/references/home-reference.png |
| SOURCE-03 | Engineering Record reference | ChatGPT Image Oct 4, 2026, 10_48_28 AM(2).png | 1671 × 941 | 74452369f45057290ccc6107adba91a6b71bac9285fc11165152f4c66bb7a3a0 | docs/design-foundation/references/engineering-record-reference.png |
| SOURCE-04 | About reference | ChatGPT Image Oct 4, 2026, 11_03_22 AM(2).png | 1670 × 942 | 4920c149cfaeaf023f6c71a0b34e1321f3dd792c5ad12553abd4e64cbcac4d22 | docs/design-foundation/references/about-reference.png |
| SOURCE-05 | Contact reference | ChatGPT Image Oct 4, 2026, 11_12_50 AM(2).png | 1670 × 942 | 39ac87a07386189fc693be7546cd6ed0fe43a70fc249203be4aef0123f6bd05e | docs/design-foundation/references/contact-reference.png |

---

## Authority Model

### SOURCE-01 — Actual background

SOURCE-01 is the actual cinematic image intended for the finished portfolio.

It is not merely a screenshot reference.

It must be preserved as supplied.

The implementation must not:

- regenerate it;
- replace it with a similar image;
- recolor it;
- retouch it;
- add a baked-in overlay;
- crop it destructively;
- substitute another mobile background;
- alter its composition without explicit human authorization.

Responsive presentation uses CSS coverage and the approved focal position rather than modifying the source image.

### SOURCE-02 through SOURCE-05 — Screen references

These four images are approved visual evidence for the four portfolio states.

They are reference artifacts, not independent production page implementations.

They establish visual relationships including:

- shared background/environment;
- identity and header treatment;
- navigation architecture;
- active navigation state;
- card geometry and surface treatment;
- typography hierarchy;
- page-specific content composition.

They must be preserved as evidence so later implementation inspection can compare the rendered experience against the approved visual direction.

---

## Materialization Status

The source images were supplied by the human in the current design-foundation decision process.

The canonical repository paths above are the intended locations for materialization.

At the time this registry is created, the binary assets have not yet been committed to those paths.

The binary materialization is a separate step in the same authorized work package and must preserve the SHA-256 values recorded above.

If a materialized file does not match its recorded SHA-256 value, the operation must stop and the discrepancy must be reported rather than silently replacing or transforming the source.

---

## Source-of-Truth Rule

When an implementation detail conflicts with the supplied visual evidence:

1. identify the discrepancy;
2. determine whether the conflict is caused by implementation, evidence, or inspection method;
3. do not alter the approved visual source merely to make implementation easier;
4. escalate any genuine design conflict for human decision.

The images are evidence for the design. They are not permission for an agent to make new design decisions.

---

## Repository Separation

The intended repository structure is:

~~~text
docs/
├── DESIGN-FOUNDATION-CURRENT-PORTFOLIO.md
└── design-foundation/
    ├── CURRENT-PORTFOLIO-VISUAL-SOURCES.md
    └── references/
        ├── home-reference.png
        ├── engineering-record-reference.png
        ├── about-reference.png
        └── contact-reference.png

app/
└── public/
    └── assets/
        └── portfolio/
            └── cinematic-background.png
~~~

The background is an implementation asset.

The four composed screens are preserved as documentation/reference evidence.

---

## Integrity

The recorded SHA-256 values are intended to make accidental modification detectable.

Any future replacement of a source image requires explicit human authorization and a new source record/version rather than silent replacement.
