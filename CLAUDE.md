@.github/copilot-instructions.md

## Claude-Specific Notes

- Pre-commit hook `scripts/check-no-email.sh` blocks raw email addresses and `mailto:` in HTML/Liquid files — use `_includes/email-link.html` instead (already noted above, but this will hard-fail on commit).
- `Gemfile.lock` is intentionally gitignored — don't flag it as missing.
- Deployed to GitHub Pages at `https://dd4a.github.io/site/` (`baseurl: /site`). Production domain will be `dd4a.ca`.
- Memory for this project is stored in `~/.claude/projects/-Users-david-Sync-My-Code-dd4a-site/memory/`.
