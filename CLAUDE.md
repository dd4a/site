@.github/copilot-instructions.md

## Claude-Specific Notes

- Pre-commit hook `scripts/check-no-email.sh` blocks raw email addresses and email-scheme links in HTML/Liquid files — use `_includes/email-link.html` instead (already noted above, but this will hard-fail on commit).
- `Gemfile.lock` is intentionally gitignored — don't flag it as missing.
- Deployed via Cloudflare to `https://dd4a.ca/` (`baseurl: ""`). GitHub Pages origin is `https://dd4a.github.io/site/`.
- Project memory is managed by Claude Code and lives outside this repo, under `~/.claude/projects/`. The subdirectory name is derived from the repo's absolute path, so moving or re-opening the repo from a different path (or via a symlink that resolves elsewhere) points at a new, empty memory directory rather than raising an error. Claude Code resolves the exact path automatically each session — **do not record it here; this is a public repo and the path discloses local directory structure.**
