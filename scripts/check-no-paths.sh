#!/usr/bin/env bash
set -euo pipefail

# Fail if a local filesystem path leaks into tracked files.
#
# This repository is public. Absolute paths disclose the maintainer's username
# and local directory structure, which is useful reconnaissance and serves no
# purpose in a static site. Web-root-relative paths ("/assets/css/styles.css",
# href="/about/") are normal and must NOT be flagged; only filesystem paths are.
#
# SELF-SCAN: this script deliberately scans itself rather than being excluded,
# so nobody can hide a leak in the one file the gate ignores. That is why the
# patterns below use single-character regex classes, and why the comments do
# NOT spell out example paths -- a literal example would make this file flag
# itself. Keep it that way when editing: describe the shape, never write it out.
#
# KNOWN LIMITS (deliberate, documented rather than silently accepted):
#   - Binary files are skipped, so a path embedded in PNG metadata is not seen.
#   - The worktree is scanned, not the index, so a partial "git add -p" commit
#     can be blocked by content that is not part of that commit.

# Byte-wise, locale-independent matching. Without this, a text file containing
# one invalid UTF-8 byte is treated as binary and silently skipped under a
# UTF-8 locale but scanned under C -- the same file would pass locally and fail
# in CI. Also keeps [A-Za-z] ranges collation-stable.
export LC_ALL=C

echo "Checking for absolute filesystem paths in tracked files..."

# git ls-files is cwd-scoped: run from a subdirectory it lists only that
# subtree, so a leak above it would be silently missed. Always scan from root.
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ Not a git repository -- cannot determine which files to scan."
  exit 2
fi
ROOT=$(git rev-parse --show-toplevel) || exit 2
cd "$ROOT" || exit 2

# Filesystem-path shapes that disclose a local location:
#   macOS home        - the capitalised Users tree, any account name
#   Linux home        - the home tree, any account name
#   Linux root home   - the root account tree
#   Windows home      - a drive letter, then the Users tree
#   macOS volume      - a mounted volume tree
#   macOS cloud sync  - the sync-client folder under the user library
#   dash-mangled home - an absolute path flattened into a directory name,
#                       which is how tooling encodes a per-project cache dir
#
# A username segment never begins with "." -- requiring a leading alphanumeric
# keeps legitimate web routes from tripping the gate while still catching a
# genuine home directory reference.
#
# The Windows shapes require a non-letter before the drive letter. Without that
# guard, the final letter of a URL scheme followed by its colon-slash-slash
# parses as a drive reference, so any URL whose host or first path segment
# begins with the Users tree would be wrongly flagged.
PATTERNS=(
  '/[U]sers/'
  '/[h]ome/[A-Za-z0-9_-][A-Za-z0-9._-]*'
  '/[r]oot/[A-Za-z0-9._-]'
  '^[A-Za-z]:[\\/]+[U]sers'
  '[^A-Za-z][A-Za-z]:[\\/]+[U]sers'
  '/[V]olumes/'
  '[L]ibrary/CloudStorage'
  '-[U]sers-[A-Za-z0-9]'
  '-[h]ome-[A-Za-z0-9]'
)

PATTERN=$(IFS='|'; echo "${PATTERNS[*]}")

# Known-safe matches that are not leaks. Kept deliberately tiny and specific;
# this is not a general escape hatch, because a line-level opt-out marker also
# suppresses any real leak sharing that line.
#   - the GitHub Actions runner home, a public well-known CI path
EXEMPT='/[h]ome/runner'

# Collect tracked files into an array and grep them directly. Do NOT pipe
# through xargs: GNU xargs reports 123 when its child exits 1 (grep's "no
# matches", i.e. our success case) and BSD xargs collapses every nonzero child
# status to 1, so the real exit code -- the thing that distinguishes "clean"
# from "the scan broke" -- is destroyed on both platforms in opposite ways.
files=()
while IFS= read -r -d '' f; do files+=("$f"); done < <(git ls-files -z)

if [[ ${#files[@]} -eq 0 ]]; then
  echo "✅ OK: no tracked files to scan."
  exit 0
fi

# -I skips binary files, -n gives line numbers, -E for extended regex.
set +e
OCCURRENCES=$(grep -InE "$PATTERN" -- "${files[@]}")
STATUS=$?
set -e

# grep: 0 = matched, 1 = no matches (clean), 2+ = a real error.
if [[ "$STATUS" -gt 1 ]]; then
  echo "❌ Scan failed (grep exited $STATUS). Treating as a failure rather than"
  echo "   reporting a clean result from a broken check."
  exit "$STATUS"
fi

if [[ -n "$OCCURRENCES" ]]; then
  # grep -v exits 1 when every line was exempted, which is a legitimate clean
  # result here, so this must run outside set -e as well.
  set +e
  FILTERED=$(printf '%s\n' "$OCCURRENCES" | grep -vE "$EXEMPT")
  FSTATUS=$?
  set -e
  if [[ "$FSTATUS" -gt 1 ]]; then
    echo "❌ Exemption filter failed (grep exited $FSTATUS)."
    exit "$FSTATUS"
  fi
  OCCURRENCES="$FILTERED"
fi

if [[ -n "$OCCURRENCES" ]]; then
  echo "❌ Found absolute filesystem path(s) in tracked files:"
  printf '%s\n' "$OCCURRENCES"
  echo ""
  echo "This repository is public. Absolute paths disclose local directory"
  echo "structure and usernames. Use a repo-relative path, a web-root-relative"
  echo "path, or omit the path entirely."
  exit 1
fi

echo "✅ OK: no absolute filesystem paths found in tracked files."
