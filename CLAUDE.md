@.github/copilot-instructions.md

## Claude-Specific Notes

- Pre-commit hook `scripts/check-no-email.sh` blocks raw email addresses and email-scheme links in HTML/Liquid files — use `_includes/email-link.html` instead (already noted above, but this will hard-fail on commit).
- `Gemfile.lock` is intentionally gitignored — don't flag it as missing.
- Deployed via Cloudflare to `https://dd4a.ca/` (`baseurl: ""`). GitHub Pages origin is `https://dd4a.github.io/site/`.
- Memory for this project is stored in `~/.claude/projects/-Users-david-Sync-My-Code-dd4a-site/memory/`.
