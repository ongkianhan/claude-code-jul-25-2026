# CLAUDE.md

## What this is
Single-page marketing site. HTML + CSS + vanilla JS — no framework, no build step.

## Running
Open index.html directly in a browser. No dev server required (optionally `python3 -m http.server 8000`).

## Architecture
- index.html — sections: #home, #testimonials, #contact
- styles.css — design tokens in :root variables; mobile-first
- script.js — smooth-scroll nav + enquiry-form validation, listeners attached at top level (script tag is at end of body); form submits to FormSubmit (`FORMSUBMIT_ENDPOINT`), no backend

## Deploy
Push to `main` (GitHub repo `claude-code-jul-25-2026`)

## Notify All (prototype, dry run only)
- `data/subscribers.json` — demo/fake subscriber list (`@example.com`), not real data.
- `scripts/notify-all.js` — filters subscribers by `SEGMENT`/`SINCE` env vars and logs the match list; does not send email.
- `.github/workflows/notify-all.yml` — `workflow_dispatch` (collaborator-only) wrapper around the script.
- `.claude/commands/notify-all.md` — `/notify-all` Claude Code command that triggers the workflow via `gh workflow run`.
- No real sending is wired up: there's no submission storage and no outbound email credential configured. Don't treat this as functional bulk email — it's a prototype of the filtering/trigger UX only.
