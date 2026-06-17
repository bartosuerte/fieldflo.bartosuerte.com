# PRD — Consolidate resume + tool into one repo at `fieldflow.bartosuerte.com`

**Owner:** William R. Barton (Barton) · barton@bartosuerte.com
**Audience:** Claude Code (continue the build from the scaffold in this folder)
**Status:** Scaffold + cross-link rewiring done. Remaining: git/publish, SiteGround deploy, QA, optional polish.

---

## 1. Goal
Merge two previously-separate sites into **one repo / one site**:
- **Interactive resume** → served at the **root** `https://fieldflow.bartosuerte.com/`
- **Applicant Review Tool** → served at **`/app`** → `https://fieldflow.bartosuerte.com/app`

It must look and behave exactly as the two live sites do today, just unified under one domain with relative internal links.

## 2. Decisions (locked — do not re-litigate)
- **Hosting:** SiteGround (Apache + PHP). PHP is required for `/app/claude-proxy.php` (live Claude). **No build step** — plain static HTML/CSS/JS.
- **Old subdomains:** `resume.bartosuerte.com` and `review.bartosuerte.com` **stay running as-is, in parallel.** No redirects required. This repo is the new canonical source going forward; the old sites keep their own deployed copies.
- **Repo:** **public** GitHub repo. The keyed `app/claude-proxy.php` is **gitignored**; commit only `app/claude-proxy.example.php` (no key). Same pattern as the existing `bartosuerte/Application-Review` repo.
- **Routing:** resume at `/`, tool at `/app` (subfolder). Internal links are **relative** (`/` and `/app/`).

## 3. Current state (already done in this scaffold)
This folder (`fieldflow.bartosuerte.com/`) already contains:
- Root = resume: `index.html`, `styles.css`, `content.js`, `favicon.svg`, `barton-headshot-nice.png`, `signature.png`, `app-laptop.png`, `barton-og.jpg`, `DESIGN_SYSTEM.md`.
- `/app` = tool: `index.html`, `styles.css`, `claude-proxy.php` (keyed), `claude-proxy.example.php`, `favicon.svg`.
- `.gitignore` (excludes `app/claude-proxy.php`), `README.md`, this `PRD.md`.

**Cross-links already rewired (verify, don't redo):**
- Resume → tool: all `https://review.bartosuerte.com` are now `/app/` (in `index.html` ×4 and `content.js` ×4: `nav.tool.href`, `proof.ctaHref`, `proof.imageHref`, footer contact).
- Resume `og:url` → `https://fieldflow.bartosuerte.com/`.
- Tool → resume: "View Interactive Resume" button now `href="/"` (same-tab).
- Tool `og:url` → `https://fieldflow.bartosuerte.com/app`.
- Tool proxy call is relative `./claude-proxy.php` → resolves to `/app/claude-proxy.php` (no change needed).
- Proxy same-origin guard uses `HTTP_HOST` (works on the new domain automatically).
- Tool `LIVE_AI = true` (top of `<script>` in `app/index.html`).

## 4. Remaining work (build it out)

### 4.1 Initialize the repo + publish (run on Barton's Mac — git can't run in the Cowork sandbox on this Drive folder)
1. `cd` into this folder.
2. `git init -b main` → `git add -A` → `git commit -m "Consolidated resume + review tool"`.
3. **Verify the key is excluded:** `git ls-files | grep claude-proxy.php` must print nothing (only the `.example` is tracked).
4. Create a **public** GitHub repo (suggest name `fieldflow` or `fieldflow-bartosuerte`) and push. (No README/license/.gitignore added on github.com — keep the remote empty so the first push isn't rejected.)

### 4.2 Verify links + relative paths (QA pass on the merged files)
- Confirm every internal link works under `/` and `/app/` with no leftover absolute `*.bartosuerte.com` links except external `https://bartosuerte.com` (the separate portfolio site) and `https://linkedin.com/...`.
- Confirm root-relative asset paths resolve: e.g. tool `og:image` is `/barton-og.jpg` → must exist at repo root (it does). Resume assets are same-dir relative.
- Confirm the `<use href="#logoB">` SVG symbol exists in both `index.html` files (it's inlined per-page).

### 4.3 SiteGround deploy
- Point/confirm the `fieldflow` subdomain's document root, upload the **whole tree** (root files + `/app` subfolder).
- **Include `app/claude-proxy.php` with the real key** (it's gitignored, so upload it manually / SFTP). Ensure `app/claude-proxy.example.php` is the only proxy in git.
- Filenames are **case-sensitive** on the server — match exactly (`styles.css`, `content.js`, `barton-headshot-nice.png`, etc.).
- Optional `.htaccess` at root for niceties: long cache on images/fonts, and ensure `/app` resolves to `/app/index.html` (Apache does this by default; add `DirectoryIndex index.html` if needed).

### 4.4 Cache-busting
- Resume links `styles.css?v=3` and `content.js?v=2`; tool links `styles.css?v=2`. **Bump the `?v=N`** whenever you change that file so browsers don't serve a stale copy. (This is the #1 "looks right locally, broken live" cause — already bitten once.)

### 4.5 Live-Claude smoke test (after deploy)
On `https://fieldflow.bartosuerte.com/app`:
- "Load my application" → Grade → confirm the deterministic score renders.
- Confirm **AI Analysis** panel returns a Claude answer (not "AI analysis unavailable"). If it errors, the proxy now surfaces the real reason — read it. Common causes: stale proxy on server (re-upload), rate limit (60 calls/10 min/IP — wait), or bad/empty API key.
- Confirm "Ask anything" returns live answers; confirm a portfolio URL gets "content reviewed."

## 5. Architecture notes
- Two independent static pages sharing a domain; **no shared bundle** (each page inlines its own `<style>`-linked `styles.css`, logo symbol, and `<script>`). That's intentional for zero-build simplicity. If you later want to DRY this up, that's section 7 (optional), not required.
- The resume is **content-driven**: all copy lives in `content.js` (`window.SITE`), read by a small binder in `index.html` (`data-c` / `data-ch` / `data-cref` / `data-csrc`) with baked-in HTML fallback. The tool is **not** externalized this way (its copy is inline) — see optional 7.2.
- The proxy (`app/claude-proxy.php`) modes: `ping`, `fetch_url` (no key, reads a URL), `analyze`, `categories`, `ask`, `tailor`. Rate limit 60/10min/IP on Claude-calling modes only. It now returns the real upstream error in `answer` instead of hiding it.

## 6. Acceptance criteria
- [ ] `https://fieldflow.bartosuerte.com/` shows the full resume; all sections render from `content.js`.
- [ ] Resume's "Applicant Review Tool" CTA, proof button, proof image, and footer link all open `/app`.
- [ ] `https://fieldflow.bartosuerte.com/app` shows the tool; "View Interactive Resume" returns to `/`.
- [ ] Tool grading works; **AI Analysis + Ask return live Claude** answers.
- [ ] No mixed-content or 404s in console; favicons load on both pages.
- [ ] Mobile nav is clean on both (logo mark + primary button; secondary hidden ≤860/820px).
- [ ] `git ls-files` shows **no** `app/claude-proxy.php`; repo is public; `.example` proxy is committed.
- [ ] Old `resume.` / `review.` subdomains still load (untouched).

## 7. Optional / nice-to-have (only if time; not blocking)
1. **Shared assets:** `favicon.svg` and `barton-og.jpg` are duplicated. Could centralize, but duplication is harmless on static hosting.
2. **Externalize the tool's copy** into an `app/content.js` like the resume, so all words live in data files.
3. **`.htaccess`:** cache headers + force-HTTPS + optional pretty-URL for `/app`.
4. **Single shared `tokens.css`** imported by both stylesheets (the design tokens are identical) — would remove drift, but adds an extra request.
5. Decide later whether to 301 the old subdomains to fieldflow (currently kept live in parallel per Barton's choice).

## 8. Guardrails / house rules (keep consistent with the brand)
- **No em dashes, no italics** in copy (italics render as monospace by design). One gold accent only (`#F8B828`).
- **Never commit the API key.** If a key ever lands in git history, rotate it.
- Edit files surgically; don't reformat or restructure working markup unnecessarily.
- Keep `content.js` as the single source of resume copy; don't reintroduce hardcoded resume text in `index.html` except as the existing fallback.

## 9. Reference
- Design system + brand voice: `DESIGN_SYSTEM.md` (this repo) and the original Claude Design bundle.
- Project background (the FieldFlō application this supports, the Sam→Corey referral, honest-positioning rules): `../PROJECT_MEMORY.md`.
- Existing repos for diffing: `bartosuerte/Application-Review` (tool) and the resume repo.
