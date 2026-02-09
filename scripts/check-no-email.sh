#!/usr/bin/env bash
set -euo pipefail

# Fail if these patterns appear in tracked source files.
# (We allow "mailto:" inside JS string literals if you want; if you want to ban it entirely, remove the JS exception.)

echo "Checking for forbidden email patterns in tracked files..."

# Only check tracked files, exclude _site and vendor-like dirs
FILES=$(git ls-files \
  | grep -v '^_site/' \
  | grep -v '^vendor/' \
  | grep -v '^\.bundle/' \
  | grep -v '^\.jekyll-cache/' \
  | grep -v '^\.gitignore$' \
  | tr '\n' ' ')

# 1) Raw email (allow in schema.org JSON-LD blocks only)
RAW_EMAIL_PATTERN='info@dd4a\.ca'
ALLOW_IN_SCHEMA_ORG='"email": "info@dd4a.ca"'
RAW_EMAIL_OCCURRENCES=$(grep -nE "$RAW_EMAIL_PATTERN" $FILES || true)
FORBIDDEN_EMAIL_OCCURRENCES=$(echo "$RAW_EMAIL_OCCURRENCES" | grep -v "$ALLOW_IN_SCHEMA_ORG" || true)
if [[ -n "$FORBIDDEN_EMAIL_OCCURRENCES" ]]; then
  echo "❌ Found raw email address in tracked files (outside allowed schema.org JSON-LD blocks):"
  echo "$FORBIDDEN_EMAIL_OCCURRENCES"
  exit 1
fi

# 2) mailto: in HTML/templates (allow in JS)
HTML_FILES=$(git ls-files \
  | grep -v '^_site/' \
  | grep -E '\.(html|md|liquid)$' || true)

if [[ -n "${HTML_FILES}" ]] && grep -nE 'mailto:' $HTML_FILES >/dev/null; then
  echo "❌ Found 'mailto:' in HTML/Markdown/Liquid files:"
  grep -nE 'mailto:' $HTML_FILES
  echo ""
  echo "Use the js-email include/pattern instead."
  exit 1
fi

echo "✅ OK: no raw email or mailto: found in source templates."
#
