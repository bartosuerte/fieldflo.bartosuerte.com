# fieldflow.bartosuerte.com

William R. Barton's interactive resume **and** the Applicant Review Tool, in one repo.

- **`/`** (root) — the interactive resume. Static HTML/CSS/JS; all copy lives in `content.js`.
- **`/app`** — the Applicant Review Tool. Static, plus `claude-proxy.php` (PHP) for the live-Claude features.

Hosted on **SiteGround** (PHP is required for `/app/claude-proxy.php`). Plain static — no build step.

## Structure
```
/                      interactive resume (root)
  index.html
  styles.css           ?v=N cache-bust in the <link>
  content.js           ← edit ALL resume text here (?v=N in the <script>)
  favicon.svg  barton-headshot-nice.png  signature.png  app-laptop.png  barton-og.jpg
  DESIGN_SYSTEM.md     brand/design reference
/app/                  Applicant Review Tool
  index.html           LIVE_AI flag near top of <script>
  styles.css
  claude-proxy.php          ← live proxy WITH your API key (gitignored, upload manually)
  claude-proxy.example.php  ← committed, no key
  favicon.svg
.gitignore             keeps app/claude-proxy.php out of git
```

## Live Claude (the tool)
`app/index.html` calls `./claude-proxy.php` (resolves to `/app/claude-proxy.php`). The proxy holds the
Anthropic API key server-side and is **gitignored**. To run live AI: set `const LIVE_AI=true` in
`app/index.html`, put your key in `app/claude-proxy.php` (`$API_KEY = 'sk-ant-...'`), and upload the proxy.

## Deploy (SiteGround)
Upload the repo contents into the `fieldflow.bartosuerte.com` document root, with `/app` as a subfolder.
Include `app/claude-proxy.php` (with key) — it's not in git. After any CSS/content change, bump the
`?v=N` query in the `<link>`/`<script>` tags so browsers fetch fresh.

See **PRD.md** for the full build/QA/deploy spec.
