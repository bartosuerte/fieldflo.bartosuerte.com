# CLAUDE.md — read this first

This repo serves **two static sites under one domain** on SiteGround (Apache + PHP, **no build step**):
- `/` → interactive resume
- `/app` → Applicant Review Tool

**START WITH `PRD.md`.** It has the goal, locked decisions, what's already done, the remaining task list, acceptance criteria, and deploy steps. `README.md` is the short orientation.

## Hard rules (do not break)
- **Never commit `app/claude-proxy.php`** — it holds the real Anthropic API key. It is gitignored; only `app/claude-proxy.example.php` (no key) is committed. If a key ever reaches git history, rotate it.
- **No em dashes. No italics** (italics are rendered as monospace by design). One gold accent only: `#F8B828`.
- **Edit surgically.** Don't reformat or restructure working markup/CSS/JS unless the task requires it.
- **Resume copy lives in `content.js`** (`window.SITE`). Don't hardcode resume text back into `index.html` except as the existing fallback.
- **Cache-bust on every CSS/content change:** bump the `?v=N` on the `<link>`/`<script>` tags (current: resume `styles.css?v=3`, `content.js?v=2`; tool `styles.css?v=2`). This is the top cause of "works locally, broken live."
- **Filenames are case-sensitive** on the server — match exactly.

## Environment
- **Run git on the Mac, not in a sandbox.** Git operations fail on this Google Drive mount inside Cowork (`.git` permission errors). Init/commit/push locally.
- Internal links are **relative** (`/` and `/app/`); the proxy call is relative (`./claude-proxy.php`). Keep them that way.
- Live AI is ON: `const LIVE_AI=true` near the top of `app/index.html`'s `<script>`. The proxy modes and rate limits are documented in `app/claude-proxy.php`.

## Where things are
```
/  index.html  styles.css  content.js  favicon.svg  *.png  barton-og.jpg  DESIGN_SYSTEM.md
/app/  index.html  styles.css  claude-proxy.php(gitignored)  claude-proxy.example.php  favicon.svg
PRD.md  README.md  .gitignore
```

Background on the project (the FieldFlō application this supports, the referral, honest-positioning rules): `../PROJECT_MEMORY.md`.
