# Momentum Marketing Consultancy — Website

A single-page marketing consultancy website built with vanilla HTML, CSS, and JavaScript — no frameworks or external dependencies (aside from an optional Google Font).

**Live site:** https://ongkianhan.github.io/claude-code-jul-25-2026/

![Screenshot of the Momentum landing page hero section](assets/screenshot.png)

## About

This is a landing page for a fictional marketing consultancy ("Momentum") designed to showcase the firm's value proposition, build trust through client testimonials, and convert visitors into leads via a contact form.

## Structure

| File | Purpose |
|---|---|
| [index.html](index.html) | Page markup |
| [styles.css](styles.css) | All styling |
| [script.js](script.js) | Nav, scroll-reveal, hero canvas, stat counters, both forms |
| [resources/marketing-growth-checklist.html](resources/marketing-growth-checklist.html) | The real lead-magnet deliverable (10-point marketing audit) |

The homepage is one continuous scroll with a sticky nav:

| Section | Anchor | Purpose |
|---|---|---|
| **Home** | `#home` | Hero — headline, CTAs, animated stats |
| **Services** | `#services` | Four core service areas |
| **Results** | `#results` | Horizontal-scroll gallery of client outcomes |
| **Testimonials** | `#testimonials` | Social proof from three clients |
| **Free Checklist** | `#checklist` | Lead magnet — email-gated growth checklist |
| **FAQ** | `#faq` | Native `<details>` accordion, also marked up as FAQPage schema |
| **Contact** | `#contact` | Full enquiry form |

## Functionality

- **Sticky nav bar** — blurs/shadows once scrolled, hamburger menu below 860px (keyboard- and screen-reader-accessible via `aria-expanded`).
- **Hero network animation** — lightweight vanilla-JS `<canvas>` of drifting, connecting nodes behind the headline; freezes to a static frame under `prefers-reduced-motion` and pauses when the tab is hidden.
- **Scroll-reveal** — sections/cards fade/rise into view via `IntersectionObserver` (`.reveal` class); skipped entirely under reduced motion.
- **Animated stat counters** — hero numbers count up once scrolled into view.
- **Results gallery** — touch-friendly horizontal scroll-snap of client outcome cards.
- **Enquiry form** — Name, Email, Company (optional), Message. Client-side validation, focuses the first invalid field, submits as JSON to [FormSubmit](https://formsubmit.co/) via `fetch()`.
- **Lead-magnet form** — Name + email-only (low-friction) capture. On submit, also sets FormSubmit's `_autoresponse` field so the submitter automatically gets an email back with a direct link to the checklist page — no backend or storage needed.
  - **FormSubmit endpoint**: `FORMSUBMIT_ENDPOINT` in [script.js](script.js) is set to `https://formsubmit.co/ajax/kianhan97@gmail.com`.

## Notify subscribers (prototype)

[![Run notify-all](https://img.shields.io/badge/Run-Notify%20All-6c5ce7?logo=githubactions&logoColor=white)](https://github.com/ongkianhan/claude-code-jul-25-2026/actions/workflows/notify-all.yml)

[.github/workflows/notify-all.yml](.github/workflows/notify-all.yml) is a `workflow_dispatch`-triggered, collaborator-only Action that previews which subscribers would receive the enquiry-form link, filtered by `segment` (`all` / `leads` / `newsletter`) and an optional `since` date. Click the badge above (or use the `/notify-all` Claude Code command) to open the Actions page and run it — you'll need to be signed in as a repo collaborator.

**This is a dry run against demo data only.** [data/subscribers.json](data/subscribers.json) is a small set of fake `@example.com` entries for prototyping the filter logic — not real subscribers. [scripts/notify-all.js](scripts/notify-all.js) only logs the matched recipient list; no email is actually sent. Wiring up a real send requires:
- Real subscriber data (currently nothing stores form submissions anywhere — FormSubmit just emails the owner and discards the rest).
- An outbound email credential (e.g. a Gmail App Password or a transactional email API key) added as a GitHub Actions secret.
- Explicit opt-in/consent tracking per recipient before any real bulk send, to stay compliant with anti-spam law (CAN-SPAM/GDPR).

## Claude Code skills

This repo has [Claude Code Skills](https://github.com/vercel-labs/agent-skills) installed via the [`skills` CLI](https://skills.sh/) (tracked in [skills-lock.json](skills-lock.json), files under [.agents/skills/](.agents/skills/), symlinked into `.claude/skills/`):

| Skill | Source | Use for |
|---|---|---|
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Reviewing UI code against Vercel's Web Interface Guidelines |
| `seo-audit` | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | Diagnosing on-page/technical SEO issues |
| `lead-magnets` | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | Planning gated content/email-capture offers |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design-system recommendations (style, color, typography, motion) from a local searchable database |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) | General frontend design guidance |

Ask Claude to use one directly (e.g. "run a web-design-guidelines review on index.html") — no separate install step needed once cloned, since the skill files are committed.

**Applied from these skills:**
- `web-design-guidelines` / `frontend-design`: semantic `<main>` + skip-link, `:focus-visible` throughout, `prefers-reduced-motion` support everywhere animation is used, form `autocomplete`/`inputmode`/`spellcheck`, `aria-live` status messages, focus-first-invalid-field, mobile hamburger nav (the previous `display:none` breakpoint left nav completely unreachable on mobile).
- `seo-audit`: meta description/canonical/Open Graph/Twitter Card tags, `MarketingAgency` + `FAQPage` JSON-LD, `robots.txt`/`sitemap.xml` (now including the checklist resource page), expanded on-page content (Services/Results/FAQ) for topical depth, single-H1/proper H2–H3 hierarchy throughout.
- `ui-ux-pro-max`: earlier research flagged this site's old dark-purple theme as an "AI-default" pattern to avoid for a B2B "Trust & Authority" positioning, recommending a blue-on-light system instead — that's the basis for the current white/blue redesign below.
- `lead-magnets`: the `#checklist` section follows its gating guidance directly — top-of-funnel offer, email-only field (lowest friction), instant delivery, explicit "no spam" microcopy.

## Design

Redesigned around a **white/blue, futuristic-but-approachable** direction — see the [frontend-design](.agents/skills/frontend-design/SKILL.md) skill's process (token plan → critique → build) for the reasoning:

- **Color**: soft blue-white background (`--bg: #f7faff`), white card surfaces, a blue-to-cyan accent gradient (`--accent` `#2e6bff` → `--accent-2` `#00c2d1`) — deliberately blue/cyan rather than the purple the design-system audit flagged as templated.
- **Type**: Space Grotesk (headings, distinctive/technical without being cold) + DM Sans (body, warm and highly readable) + Space Mono used sparingly for eyebrows and stat figures — a small "data" texture, not overused.
- **Signature element**: an ambient, animated node network in the hero canvas — nods to "advanced technology" without relying on a generic dark/neon look.
- **Approachability**: generous whitespace, 16px corner radius, plain-spoken second-person copy, and a FAQ section addressing common hesitations directly.
- Mobile-first, fully responsive layout using CSS Grid/Flexbox with breakpoints at `980px`, `860px`, `640px`, and `480px`.

## Running locally

No build step required — just open [index.html](index.html) directly in a browser, or serve it with any static file server:

```bash
python3 -m http.server 8000
```

## Deployment

Every push to `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which publishes the site to GitHub Pages at https://ongkianhan.github.io/claude-code-jul-25-2026/.

## To do before going live

- Swap placeholder testimonial content/avatars for real client quotes.
- Update footer copyright and any brand-specific copy ("Momentum") as needed.
