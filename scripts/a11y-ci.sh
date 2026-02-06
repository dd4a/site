#!/usr/bin/env bash
set -euo pipefail

# 1) Install Ruby gems (if needed)
bundle install

# 2) Build the site
bundle exec jekyll build

# 3) Serve built output + run checks
npx http-server ./_site -p 8080 -c-1 --silent &
SERVER_PID=$!

# Ensure we always stop the server
cleanup() { kill "$SERVER_PID" >/dev/null 2>&1 || true; }
trap cleanup EXIT

node ./scripts/wait-for.mjs http://127.0.0.1:8080/ 30
node ./scripts/a11y-check.mjs
npx html-validate "_site/**/*.html"
