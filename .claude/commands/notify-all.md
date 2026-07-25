---
description: Trigger the Notify All workflow to preview which subscribers would receive the enquiry-form link, filtered by segment and date
---

Run the `notify-all` GitHub Actions workflow for this repository. This is a **dry run only** — no real email currently gets sent (there's no send-credential secret configured yet); it prints the filtered recipient list so the targeting logic can be reviewed.

1. Ask the user which `segment` to target (`all`, `leads`, or `newsletter`) and, optionally, a `since` date (`YYYY-MM-DD`) if not already specified.
2. Trigger the workflow: `gh workflow run notify-all.yml -f segment=<segment> -f since=<since>`.
3. Watch the run and surface the log output (the matched recipient list) back to the user: `gh run watch <run-id>` after locating the new run with `gh run list --workflow=notify-all.yml --limit 1`.
4. Remind the user this is a dry run against demo data in `data/subscribers.json` — wiring up real sending requires real subscriber data plus an email-sending credential (e.g. Gmail App Password or a transactional email API key) stored as a GitHub Actions secret, which the user must provide.
