# CLAUDE.md

## What this is
Single-page marketing site. HTML + CSS + vanilla JS — no framework, no build step.

## Running
Open index.html directly in a browser. No dev server required (optionally `python3 -m http.server 8000`).

## Architecture
- index.html — `<main>` landmark wraps #home/#services/#results/#testimonials/#checklist/#faq/#contact; skip-link + mobile hamburger nav (`#nav-toggle`/`#nav-links`) precede it; SEO meta + `MarketingAgency`/`FAQPage` JSON-LD in `<head>`
- styles.css — white/blue design tokens in :root (`--accent`/`--accent-2` = blue→cyan, not purple — deliberate per `ui-ux-pro-max` audit); mobile-first; `:focus-visible` + `prefers-reduced-motion` handled globally; `.reveal`/`.reveal.visible` drive scroll-in animation
- script.js — nav scroll state, mobile nav toggle, `IntersectionObserver` scroll-reveal, animated stat counters, hero `<canvas>` node-network animation (pauses on `prefers-reduced-motion` and on tab-hidden), two form handlers (`#enquiry-form` full contact form, `#checklist-form` email-only lead magnet with FormSubmit `_autoresponse`) — both submit to `FORMSUBMIT_ENDPOINT`, no backend
- resources/marketing-growth-checklist.html — real content page delivered by the lead-magnet autoresponse; keep genuinely useful/generic, not fabricated stats
- robots.txt / sitemap.xml — crawlability, includes the resources page

## Deploy
Push to `main` (GitHub repo `claude-code-jul-25-2026`)

## Claude Code skills
Installed via the `skills` CLI, tracked in `skills-lock.json`, files under `.agents/skills/` (symlinked into `.claude/skills/`): `web-design-guidelines` (vercel-labs/agent-skills), `seo-audit` + `lead-magnets` (coreyhaines31/marketingskills), `ui-ux-pro-max` (nextlevelbuilder/ui-ux-pro-max-skill), `frontend-design` (anthropics/skills). Reviewed for malicious content before install — clean. Declined a 6th requested skill (`anthropic-cybersecurity-skills` from `aradotso/security-skills`) — that repo is an unvetted aggregator with an impersonation-flavored name and red-flag neighboring entries (spoofing/pentest tools), not affiliated with Anthropic despite the name.

## Notify All (prototype, dry run only)
- `data/subscribers.json` — demo/fake subscriber list (`@example.com`), not real data.
- `scripts/notify-all.js` — filters subscribers by `SEGMENT`/`SINCE` env vars and logs the match list; does not send email.
- `.github/workflows/notify-all.yml` — `workflow_dispatch` (collaborator-only) wrapper around the script.
- `.claude/commands/notify-all.md` — `/notify-all` Claude Code command that triggers the workflow via `gh workflow run`.
- No real sending is wired up: there's no submission storage and no outbound email credential configured. Don't treat this as functional bulk email — it's a prototype of the filtering/trigger UX only.
