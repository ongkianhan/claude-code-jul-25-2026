---
description: Push code to GitHub, sync README/repo metadata, deploy GitHub Pages via Actions, and run a security scan first
---

Run the following workflow end-to-end for this repository. Confirm with the user before any step that pushes to the remote, changes repo settings, or enables Pages, unless they've already approved this command's scope for the session.

1. **Security scan (do this first, before anything is staged/committed)**
   - Review all changed/untracked files for secrets: API keys, tokens, passwords, private keys, `.env` files, credentials, connection strings, or other sensitive data.
   - Check `.gitignore` exists and covers common sensitive patterns (`.env*`, `*.key`, `*.pem`, credentials files, `node_modules/`, OS/editor cruft). Create or update it if missing/incomplete.
   - If anything sensitive is found, stop and flag it to the user — do not stage or commit it. Do not proceed to the push step until resolved.

2. **Push/update code to GitHub**
   - Run `git status` and `git diff` to see what's changed.
   - Stage only the intended files (never blanket `git add -A` without reviewing status first).
   - Commit with a concise message describing the change.
   - Push to `main` (or the current branch), asking first if this session hasn't already been authorized to push.

3. **Create/update README.md**
   - Reflect the current file structure, functionality, and setup/run instructions based on the actual code — not assumptions.
   - Keep it high-signal: what the project is, structure, key functionality, how to run it locally.

4. **Create/update the repo's About section**
   - Use `gh repo edit` to set/update the description and topics based on the current state of the project.

5. **Deploy GitHub Pages via GitHub Actions**
   - Add or update `.github/workflows/deploy.yml` using `actions/checkout`, `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.
   - Enable Pages on the repo with build source `workflow` via `gh api repos/{owner}/{repo}/pages -X POST -f build_type=workflow` if not already enabled.
   - Trigger and watch the workflow run to confirm it deploys successfully (`gh workflow run`, `gh run watch`).

6. **Add the GitHub Pages link to the About section**
   - Once the Pages URL is live, set it as the repo homepage via `gh repo edit --homepage <pages-url>` (can be combined with step 4's `gh repo edit` call).

Report back with: what was committed/pushed, the README/About updates made, the live Pages URL, and the outcome of the security scan (clean, or what was found/excluded).
