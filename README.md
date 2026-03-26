# dd4a/site

Source for [dd4a.ca](https://dd4a.ca) — Digital Design 4 All, digital accessibility consulting.

Built with Jekyll, deployed to GitHub Pages.

---

## Local development

**Requirements**
- Ruby 3.3+
- Node.js 20+
- Bundler (`gem install bundler`)

**Setup**
```bash
bundle install
npm install
```

**Run locally**
```bash
bundle exec jekyll serve
```

Site available at `http://localhost:4000/site/`

**Note:** `Gemfile.lock` is intentionally gitignored to avoid lockfile churn across Ruby environments. GitHub Pages manages its own pinned dependencies at build time.

---

## Pre-commit hook

A pre-commit hook prevents raw email addresses and email-scheme links from being committed to source files. To install it:
```bash
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks
```

The hook allows `"email": "info@dd4a.ca"` in schema.org JSON-LD blocks only. All other occurrences of the email address or email-scheme links in HTML/Liquid/Markdown files will block the commit.

---

## CI/CD

Three GitHub Actions workflows run on push and pull request:

| Workflow | File | Purpose |
|---|---|---|
| Build and deploy | `.github/workflows/pages.yml` | Builds with Jekyll and deploys to GitHub Pages (main branch only) |
| Accessibility regression | `.github/workflows/a11y-regression.yml` | Builds site, runs HTML validation and axe accessibility checks |
| Email safety | `.github/workflows/no-email.yml` | Enforces no raw email in source files |

---

## Accessibility checks

Run the full accessibility CI suite locally:
```bash
npm run a11y:ci
```

This builds the site, serves it on port 8080, waits for the server, runs axe checks across all pages, and validates HTML output.

Run checks individually:
```bash
npm run a11y:build      # Jekyll build only
npm run a11y:serve      # Serve _site on port 8080
npm run a11y:test       # Run axe checks (requires server running)
npm run html:validate   # Validate HTML output
```

Pages checked: `/`, `/services.html`, `/work.html`, `/resources.html`,
`/contact.html`, `/privacy.html`, `/accessibility.html`, `/about.html`,
`/404.html`

Standards: WCAG 2.0 A, WCAG 2.0 AA, WCAG 2.1 AA, WCAG 2.2 AA

---

## Branches

| Branch | Purpose |
|---|---|
| `main` | Production — deploys automatically to GitHub Pages |

---

## Key architecture decisions

- **Email obfuscation** — email addresses are never stored in plain text   in HTML or Liquid templates. The `_includes/email-link.html` include renders a base64-encoded `data-email` attribute; `assets/js/site.js` decodes it client-side and constructs the email link. A `<noscript>` fallback shows `info [at] dd4a.ca`.

- **No analytics** — no tracking scripts, cookies, or third-party services. Confirmed in privacy policy.

- **Manifest** — `site.webmanifest` is at the repo root (not in `assets/`) so Jekyll processes it with Liquid and resolves `{{ site.baseurl }}` correctly in icon paths.

- **Gemfile.lock** — gitignored intentionally. See note under local development above.

---

## Deployment

Pushes to `main` trigger the pages workflow automatically. The site is available at:

- `https://dd4a.github.io/site/` (current)
- `https://dd4a.ca/` (production domain — pending DNS setup)
