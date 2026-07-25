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
