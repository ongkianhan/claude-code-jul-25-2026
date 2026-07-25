# CLAUDE.md

## What this is
Single-page marketing site. HTML + CSS + vanilla JS — no framework, no build step.

## Running
Open index.html directly in a browser. No dev server required (optionally `python3 -m http.server 8000`).

## Architecture
- index.html — `<main>` landmark wraps #home/#services/#results/#testimonials/#checklist/#faq/#contact; skip-link + mobile hamburger nav (`#nav-toggle`/`#nav-links`) precede it; SEO meta + `MarketingAgency`/`FAQPage` JSON-LD in `<head>`
- styles.css — white/blue design tokens in :root (`--accent`/`--accent-2` = blue→cyan, not purple — deliberate per `ui-ux-pro-max` audit); mobile-first; `:focus-visible` + `prefers-reduced-motion` handled globally; `.reveal`/`.reveal.visible` drive scroll-in animation
- script.js — nav scroll state, mobile nav toggle, `IntersectionObserver` scroll-reveal, animated stat counters, hero `<canvas>` node-network animation (pauses on `prefers-reduced-motion` and on tab-hidden), two form handlers (`#enquiry-form` full contact form, `#checklist-form` email-only lead magnet with FormSubmit `_autoresponse`) — both submit to `FORMSUBMIT_ENDPOINT`, no backend. `validateForm()`/`validateChecklistForm()` block submission until required fields pass (client-side only — there is no server to re-validate, so don't treat this as a security boundary). `speak()` uses the Web Speech API to read a confirmation aloud after a successful `#enquiry-form` submit — wording kept in sync with the site's "one business day" response-time promise (hero stat, FAQ, contact bullet). The user's original request said "3 business days"; changed to match on explicit instruction.
- resources/marketing-growth-checklist.html — real content page delivered by the lead-magnet autoresponse; keep genuinely useful/generic, not fabricated stats
- robots.txt / sitemap.xml — crawlability, includes the resources page

## Deploy
Push to `main` (GitHub repo `claude-code-jul-25-2026`)

## Note on Claude Code hooks
`.claude/hooks` (PreToolUse/PostToolUse) intercept Claude Code's own tool calls during a session — they don't run in a site visitor's browser and can't affect the deployed site (form validation, audio, etc.). Anything meant to run when a visitor uses the site belongs in script.js.

## Claude Code skills
Installed via the `skills` CLI, tracked in `skills-lock.json`, files under `.agents/skills/` (symlinked into `.claude/skills/`): `web-design-guidelines` (vercel-labs/agent-skills), `seo-audit` + `lead-magnets` (coreyhaines31/marketingskills), `ui-ux-pro-max` (nextlevelbuilder/ui-ux-pro-max-skill), `frontend-design` (anthropics/skills). Reviewed for malicious content before install — clean. Declined a 6th requested skill (`anthropic-cybersecurity-skills` from `aradotso/security-skills`) — that repo is an unvetted aggregator with an impersonation-flavored name and red-flag neighboring entries (spoofing/pentest tools), not affiliated with Anthropic despite the name.

## Security scanning
- `.claude/agents/security-scanner.md` — on-demand project subagent for defensive, read-only security review (committed secrets, risky JS patterns, live-vs-repo drift, TLS/reachability). Scoped deliberately to what's real for a static site with no server — doesn't check for SQLi/server RCE/auth, since none of that applies here. Requires a session restart to appear in the agent list after being added.
- `scripts/security-scan.sh` — the automated version of that same check; run directly (`./scripts/security-scan.sh`) or via the workflow below. Writes findings to `/tmp/security-scan-findings.txt`.
- `.github/workflows/security-scan.yml` — runs the script daily at `0 0 * * *` (00:00 **UTC**, not the user's local midnight — clarify/change the cron if a different timezone is wanted) plus on manual `workflow_dispatch`. Emails a report to kianhan97@gmail.com via the same FormSubmit endpoint already used elsewhere in this repo, **only if findings are non-empty** — silent on clean runs (check the Actions tab for those).
- Known limitation: the live-vs-repo drift check compares the live site against a git checkout of HEAD, so it only makes sense in CI (clean checkout) or against a fully-committed-and-pushed local tree — running it locally with uncommitted changes will report a mismatch that isn't a real security issue, just pending work not yet deployed.
- GitHub Pages doesn't allow custom response headers (no CSP/HSTS control) — the agent/script deliberately don't flag that as an actionable finding, since there's nothing to fix on this host.

## Notify All (prototype, dry run only)
- `data/subscribers.json` — demo/fake subscriber list (`@example.com`), not real data.
- `scripts/notify-all.js` — filters subscribers by `SEGMENT`/`SINCE` env vars and logs the match list; does not send email.
- `.github/workflows/notify-all.yml` — `workflow_dispatch` (collaborator-only) wrapper around the script.
- `.claude/commands/notify-all.md` — `/notify-all` Claude Code command that triggers the workflow via `gh workflow run`.
- No real sending is wired up: there's no submission storage and no outbound email credential configured. Don't treat this as functional bulk email — it's a prototype of the filtering/trigger UX only.
