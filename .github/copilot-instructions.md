# Project Guidelines

## Architecture
- This is a Jekyll static site. Edit source files in the repo root, `_includes/`, `_layouts/`, `assets/`, and `scripts/`.
- Do not edit generated output in `_site/`; rebuild instead.
- Keep shared page structure in `_layouts/default.html` and reusable snippets in `_includes/`.

## Code Style
- Follow existing plain HTML + Liquid style used by root pages (for example `index.html`, `services.html`).
- Reuse existing CSS variables and component patterns from `assets/css/styles.css`; avoid introducing new design systems or frameworks.
- Preserve `site.baseurl`-aware asset paths in templates and includes.

## Accessibility Conventions (Required)
- Every page must keep `<html lang="en">`.
- Every page must include a skip link: `<a class="skip-link" href="#main">Skip to main content</a>`.
- Main page content must live inside `<main id="main">`.
- If adding or updating email links, use `_includes/email-link.html` (obfuscated email pattern) rather than hardcoding addresses.

## Build and Validation
- Install dependencies as needed: `bundle install` and `npm install`.
- Preferred full validation command: `npm run a11y:ci`.
- Other useful checks:
  - `npm run a11y:build`
  - `npm run a11y:serve`
  - `npm run a11y:test`
  - `npm run html:validate`

## Common Pitfalls
- Frontmatter is required for root page `.html` files; keep `layout: default` unless intentionally using a different layout.
- Do not make source edits inside `node_modules/`, `.jekyll-cache/`, `.bundle-cache/`, or `_site/`.