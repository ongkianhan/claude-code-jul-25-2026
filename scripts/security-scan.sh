#!/usr/bin/env bash
# Defensive-only security check for a static site: no exploit attempts, no
# offensive tooling. Scoped to what's actually actionable for a site with
# no server: committed secrets, risky JS patterns, and live-vs-repo drift.
set -uo pipefail

SITE_URL="https://ongkianhan.github.io/claude-code-jul-25-2026/"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FINDINGS_FILE="$(mktemp)"

add_finding() {
  echo "- $1" >> "$FINDINGS_FILE"
}

echo "## Security scan — $(date -u '+%Y-%m-%d %H:%M UTC')"

# --- 1. Committed secrets, scoped to this project's own source (not third-party skill docs) ---
SCAN_PATHS="index.html script.js styles.css README.md CLAUDE.md resources data scripts .github/workflows"
SECRET_PATTERN='(api[_-]?key|secret[_-]?key|access[_-]?token|password)\s*[:=]\s*["'"'"'][A-Za-z0-9/+_\-]{16,}["'"'"']|AKIA[0-9A-Z]{16}|-----BEGIN (RSA|OPENSSH|PRIVATE|EC) '

while IFS= read -r -d '' file; do
  match=$(grep -IinE "$SECRET_PATTERN" "$file" 2>/dev/null || true)
  if [ -n "$match" ]; then
    add_finding "Possible committed secret in \`${file#"$REPO_ROOT"/}\`: \`$(echo "$match" | head -1 | cut -c1-120)\`"
  fi
done < <(cd "$REPO_ROOT" && find $SCAN_PATHS -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.md' -o -name '*.json' -o -name '*.yml' -o -name '*.yaml' \) -print0 2>/dev/null)

# --- 2. Risky client-side JS patterns ---
for file in index.html script.js resources/marketing-growth-checklist.html; do
  path="$REPO_ROOT/$file"
  [ -f "$path" ] || continue
  grep -IinE '\beval\s*\(|new Function\s*\(|document\.write\s*\(' "$path" 2>/dev/null | while IFS= read -r line; do
    add_finding "Risky JS pattern in \`$file\`: \`$(echo "$line" | cut -c1-120)\`"
  done
  grep -IinE '\.innerHTML\s*=' "$path" 2>/dev/null | while IFS= read -r line; do
    add_finding "Unsanitized innerHTML assignment in \`$file\` (XSS risk if ever fed user input): \`$(echo "$line" | cut -c1-120)\`"
  done
  python3 - "$path" "$file" "$FINDINGS_FILE" <<'PYEOF'
import re, sys
path, label, findings_file = sys.argv[1], sys.argv[2], sys.argv[3]
html = open(path, encoding='utf-8').read()
for tag in re.findall(r'<a\b[^>]*>', html, re.DOTALL):
    if re.search(r'target\s*=\s*"_blank"', tag) and 'noopener' not in tag:
        with open(findings_file, 'a') as f:
            f.write(f"- target=_blank without rel=noopener in `{label}` (reverse tabnabbing risk): `{tag[:120].replace(chr(10), ' ')}`\n")
PYEOF
done

# --- 3. Live site reachability + TLS ---
http_code=$(curl -s -o /dev/null -w '%{http_code}' "$SITE_URL" --max-time 15 || echo "000")
if [ "$http_code" != "200" ]; then
  add_finding "Live site returned HTTP $http_code instead of 200 at $SITE_URL"
fi

if command -v openssl >/dev/null 2>&1; then
  cert_end=$(echo | openssl s_client -servername ongkianhan.github.io -connect ongkianhan.github.io:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
  if [ -z "$cert_end" ]; then
    add_finding "Could not verify TLS certificate for ongkianhan.github.io"
  fi
fi

# --- 4. Live page vs repo drift (defacement / tamper check) ---
live_html=$(curl -s "$SITE_URL" --max-time 15 || echo "")
repo_html=$(cat "$REPO_ROOT/index.html" 2>/dev/null || echo "")
if [ -n "$live_html" ] && [ -n "$repo_html" ]; then
  live_hash=$(echo "$live_html" | shasum -a 256 | cut -d' ' -f1)
  repo_hash=$(echo "$repo_html" | shasum -a 256 | cut -d' ' -f1)
  if [ "$live_hash" != "$repo_hash" ]; then
    add_finding "Live index.html does not match repo's index.html at current HEAD — could be a stale/failed deploy or unexpected tampering. Verify manually."
  fi
fi

echo ""
if [ -s "$FINDINGS_FILE" ]; then
  echo "FOUND $(wc -l < "$FINDINGS_FILE" | tr -d ' ') finding(s):"
  cat "$FINDINGS_FILE"
else
  echo "No findings."
fi

cat "$FINDINGS_FILE" > /tmp/security-scan-findings.txt
