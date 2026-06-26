<!--
============================================================================
PRD: Interview Prep  (/prep)
Audience: Claude Code -> build AND deploy this from the existing repo.
You (Code) own every implementation decision. This spec is complete: all
content sources exist on disk (see SS4), all prior open questions are now
resolved (SS12), and the FieldFlo-vs-FloTime framing is settled (SS3.5).
Build it, ship it to https://fieldflo.bartosuerte.com/prep, do not wait
for further input.

HOUSE RULES (from DESIGN_SYSTEM.md, enforce in all copy you write): no em
dashes, no italics (italics render as monospace in this system), one gold
accent only (#F8B828), sentence-case body, mono for systemy microcopy.
Keep this file OUT of the public web root (already excluded from FTPS by
the **/PRD.md rule). The GitHub repo is PRIVATE (SS2 / SS7), so committing
prep content is fine.
============================================================================
-->

# PRD - Interview Prep (`/prep`)

**Owner:** William R. Barton (Barton) - barton@bartosuerte.com
**Audience:** Claude Code. Build the site from the existing `fieldflo.bartosuerte.com` repo and deploy it. You make all implementation decisions.
**Status:** Spec complete and self-contained. Not started. All content sources exist on disk (SS4). All prior open questions resolved (SS12). No blockers.
**Route:** `https://fieldflo.bartosuerte.com/prep` (a new sub-path in the existing repo, parallel to `/app` and `/quiz`).
**Last updated:** 2026-06-26 (consolidated from all FieldFlo Cowork sessions: company profile, competitive battlecard, candidate profile, Atul dossier, interview strategy, HR screening call, design fundamentals primer).

---

## 1. Goal

Stand up a **private, mobile-first documentation site** at `/prep` that collects everything Barton needs to prepare for the FieldFlō interview loop into one fast, navigable reference he can read on his phone.

It should feel like a clean developer-docs site (think Mintlify or Stripe docs): a left sidebar nav grouped by topic, a readable center column, an "on this page" table of contents, and instant search. It must reuse the existing Bartosuerte design system (`../DESIGN_SYSTEM.md` plus the repo's `styles.css`) and the existing zero-build SiteGround plus FTPS deploy. The whole `/prep` path is password-protected and de-indexed (SS7).

**Why:** the prep material currently lives as a pile of separate `.md` and `.pdf` files in the parent folder. On a phone, that is unreadable and unsearchable. One docs site makes it skimmable the morning of an interview.

**Primary user:** Barton, on a phone, often one-handed, sometimes on spotty signal. Optimize for that first, desktop second.

**Timing context:** the loop is live and moving fast. HR screen is done (Christina, 2026-06-25). The CPO interview (Atul Kalantri) plus a roughly 2-hour case-study assignment are imminent, then a panel. Treat this as urgent: a working, readable site beats a perfect one.

---

## 2. Decisions (locked - do not re-litigate)

- **Privacy: private (two locked layers).** (1) The live `/prep` path sits behind HTTP Basic Auth and is de-indexed. (2) The GitHub repo is **private**. Full mechanism in SS7. The content includes interviewer dossiers and candid strategy. The private repo only closes the github.com exposure; the live URL is still public-facing, so Basic Auth is what actually protects it.
- **Reuse, do not reinvent.** Same repo, same design tokens, same SiteGround plus GitHub-Actions-FTPS pipeline as `/app` and `/quiz`. No new hosting, no second domain, no build step.
- **Content stays as Markdown, single source of truth.** Pages render from `.md` files. Do not paste prose into HTML. This mirrors the resume's `content.js` philosophy: words live in data, the shell just renders them.
- **Mobile-first.** If a layout tradeoff is needed, the phone wins.
- **You decide implementation.** Architecture, libraries, search depth, and routing are yours to choose. SS3 gives a recommendation and rationale; SS12 records the defaults to use so nothing blocks you.

<!-- BUILD-NOTE: "fieldflow" with a 'w' is only the LOCAL Drive folder name. The live domain and the SiteGround docroot are "fieldflo" (no 'w'): /fieldflo.bartosuerte.com/public_html/. Deploy puts /prep at public_html/prep/. Do not rename anything to fix the mismatch; it is intentional and already wired. -->

---

## 3. Recommended architecture (final call is yours)

**Recommendation: Option A.** Build it this way unless you find a concrete reason not to.

### Option A - Zero-build static plus client-side Markdown (recommended)
Plain HTML/CSS/JS. One `index.html` shell that, on load, reads a nav config, fetches the relevant `.md` file, renders it to HTML client-side, and builds the sidebar plus on-this-page TOC from it.

- **Renderer:** vendor `marked` plus `DOMPurify` into `/prep/lib/` (pinned versions, no read-time CDN dependency). There is no existing Markdown renderer anywhere in this repo, so you are building this fresh. `/app` loads pdf.js and mammoth from cdnjs at runtime, so a CDN at build-time is acceptable, but prefer vendored and pinned for a tool Barton opens offline.
- **Pros:** drops straight into the existing no-build FTPS deploy; reuses the design tokens verbatim; renders the existing `.md` files with zero conversion; adding a page is dropping a `.md` in plus one nav line. SEO does not matter (noindexed and private), which removes the only real downside of client-side rendering.
- **Cons:** requires JS to read (fine for a personal tool); search is client-side only (fine at this scale).
- **Shape:**
  ```
  /prep/
    index.html            # the docs shell (sidebar + content + TOC + search), one SPA-ish page
    prep.css              # imports/repeats the design tokens; docs-specific layout
    prep.config.js        # the nav tree: groups -> pages -> { title, file, slug }  (single source for the sidebar)
    app.js                # router (hash), md fetch + render, TOC build, search, mobile nav
    content/              # the Markdown (committed; repo is private - SS7). Fetched at runtime.
      overview.md
      candidate-profile.md
      design-fundamentals.md
      company-profile.md
      competitive-battlecard.md
      our-story.md
      the-role.md
      interviewer-atul.md
      strategy.md
      hr-screen.md
      ...
    lib/                  # vendored marked.min.js, dompurify.min.js (pinned)
    favicon.svg           # copy the 815-byte favicon.svg from /, /app, or /quiz (it is missing from /prep)
    manifest.webmanifest  # PWA (SS6.6) - copy the /quiz pattern
  ```

### Option B - Astro Starlight (or similar docs framework)
Batteries-included docs. Rejected as the default because it adds a build step to a deliberately build-free pipeline and forces re-implementing the gold/dark system as theme overrides. Pick B only if `/prep` later grows into a polished, possibly public docs product. For this use case, A.

<!-- BUILD-NOTE: Whichever you pick, the IA (SS4), layout (SS5), design system (SS6), and privacy (SS7) requirements are the same. Only the implementation differs. -->

---

## 4. Information architecture plus content model

All content already exists as files on disk. It lives in the **parent** folder (`../`, the `FieldFlo/` Drive folder), NOT in this repo, except this PRD. Part of the build is copying these into `/prep/content/` (committed to the private repo, SS7.2) and running a light house-rules normalization pass (SS4.2).

### Proposed nav tree (the sidebar)

```
Interview Prep
├─ Overview                      (NEW landing page you write, SS4.3)
├─ You
│   ├─ You as the Product         <- Candidate-Profile-Barton.md  (SS4.4 - the self-as-product spine + diagram)
│   └─ HR Screen Recap            <- FieldFlo_HR_Screening_Cheat_Sheet.md  (retrospective; the screen is done)
├─ Design Fundamentals
│   └─ Product Design Primer      <- Product-Design-Fundamentals-Primer.md
├─ The Company
│   ├─ FieldFlō Profile           <- About FieldFlo/FieldFlo Company Profile.md
│   ├─ Our Story                  <- FieldFlo OUR STORY.md
│   ├─ Competitive Battlecard     <- About FieldFlo/FieldFlo Competitive Battlecard.md
│   └─ Company Cheat Sheet        <- FieldFlo-Cheat-Sheet.pdf  (download card + short summary)
├─ The Role
│   ├─ Job Overview               <- About the job.md  (trim scraper artifacts, SS4.2)
│   └─ JD Deep Dive               <- optional, not yet written (graceful empty state, SS4.5)
├─ Interviewers
│   ├─ Atul Kalantri (CPO)        <- FieldFlo-Interviewer-Dossier-Atul-Kalantri.md
│   └─ Corey (Lead Designer)      <- optional, not yet written (graceful empty state, SS4.5)
└─ Interview Strategy
    └─ Game Plan                  <- FieldFlo-Interview-Strategy.md
```

### 4.1 Source-file mapping (current path -> target)

| Nav page | Current file (in `../`) | Target in `content/` | Status |
|---|---|---|---|
| You as the Product | `Candidate-Profile-Barton.md` | `candidate-profile.md` | exists (created this session) |
| HR Screen Recap | `FieldFlo_HR_Screening_Cheat_Sheet.md` | `hr-screen.md` | exists |
| Product Design Primer | `Product-Design-Fundamentals-Primer.md` | `design-fundamentals.md` | exists |
| FieldFlō Profile | `About FieldFlo/FieldFlo Company Profile.md` | `company-profile.md` | exists |
| Our Story | `FieldFlo OUR STORY.md` | `our-story.md` | exists |
| Competitive Battlecard | `About FieldFlo/FieldFlo Competitive Battlecard.md` | `competitive-battlecard.md` | exists |
| Company Cheat Sheet | `FieldFlo-Cheat-Sheet.pdf` | `assets/FieldFlo-Cheat-Sheet.pdf` plus summary | exists (PDF) |
| Job Overview | `About the job.md` | `the-role.md` | exists (trim, SS4.2) |
| JD Deep Dive | none | `jd-deep-dive.md` | optional, not written |
| Atul Kalantri | `FieldFlo-Interviewer-Dossier-Atul-Kalantri.md` | `interviewer-atul.md` | exists |
| Corey | none | `interviewer-corey.md` | optional, not written |
| Game Plan | `FieldFlo-Interview-Strategy.md` | `strategy.md` | exists |

<!-- BUILD-NOTE: Do NOT hardcode this list in app.js. prep.config.js is the single source for nav. Reading order and grouping come from there. The dossier (interviewer-atul.md), strategy.md, hr-screen.md, and candidate-profile.md are the most sensitive content; the PRIVATE repo is what keeps them safe, so never make the repo public while this content lives in it. -->

### 4.2 Content normalization pass (do this when copying into content/)
The existing prep `.md` files were written before the house rules were enforced, so they contain em dashes and italics that violate SS6.5 and would render as monospace (italics map to mono in this system). When you copy each source file into `content/`, run a mechanical pass:

- Replace em dashes (`-` U+2014) and en dashes used as separators with a comma, period, or hyphen.
- Unwrap `*italic*` and `_italic_` emphasis to plain text (the sources use italics for emphasis and sample answers, which read fine as plain or bold). Keep `**bold**`.
- Standardize the stray `★` accent markers to the single gold accent via CSS, not a literal star in body text.
- `About the job.md`: trim the scraper tail (the "Equal Opportunity / Benefits found in job post / Vision insurance / 401(k)" block and the duplicated phone-number line) before rendering. Keep the real JD body, comp range, excluded states, and company overview.

`Candidate-Profile-Barton.md` (created this session) is already house-rules clean and needs no pass. Keep the original source files in `../` untouched; normalize only the copies in `content/`.

### 4.3 Overview landing page
Write a short `content/overview.md`: one paragraph on what this site is, a "start here before each round" list linking to the most useful pages (You as the Product, Game Plan, the Atul dossier, the Primer SS8 cheat), and the date of the next interview. Keep it to one screen on a phone. Lead the reader to: the single throughline (the AI-native designer who ships) and the one-page case-study runbook.

### 4.4 "You as the Product" page plus diagram (priority page)
This is the page Barton most wants. Source: `Candidate-Profile-Barton.md`. It runs Barton through the design process as if he is the product being designed and pitched. The page renders the markdown, and at the top it renders a **vertical process diagram** (the source image Barton uploaded was a tall portrait infographic, so build the diagram as a tall, mobile-first vertical flow, not a wide one).

Diagram structure to build (a Double Diamond mapped onto the self-pitch; confirm against Barton's uploaded diagram, see TODO):

```
YOU AS THE PRODUCT  (vertical flow, top to bottom)

  DISCOVER  (diverge)   The raw material / the messy problem
     - 15 years, many hats, "digital problem solver"
     - the market's real pain: field adoption fails in this category
        |
  DEFINE  (converge)    The reframe / problem statement
     - "product design is what I have been doing all along"
     - the 3 JD asks: AI components, multi-role workflows, real-world complexity
        |
  DEVELOP  (diverge)    The proof / options considered
     - Applicant Review Tool (AI-UX decisions, transparent scoring, live Claude)
     - Humble & Fume rebuild (Webflow + Klaviyo + Zapier into NetSuite, +20%)
        |
  DELIVER  (converge)   The close
     - why FieldFlō, AI-native, "visibly more productive on day one"

  QUALITY BAR (lens across all four):  Dieter Rams' 10 principles +
  Nielsen heuristics = how a senior designer judges the work.
```

Implement the diagram with the design system: gold accents on the stage labels, hairline connectors, frosted-glass stage cards, mono eyebrows for the stage names. A clean CSS/SVG vertical flow is fine; no heavy library. Respect `prefers-reduced-motion`.

<!-- TODO(confirm-with-barton): The tall infographic Barton uploaded in the "Dieter Rams design principles" session could not be retrieved from that chat (inline image, not a saved file). The Double Diamond structure above is the intended self-as-product spine inferred from the session and the candidate content. If Barton's diagram differs, swap this structure to match his. Until then, build the structure above. -->

### 4.5 Not-yet-written pages (non-blocking)
`JD Deep Dive` and the `Corey` dossier were planned but not produced. They are **optional and must not block launch.** In `prep.config.js`, either omit them or include them with a flag so `app.js` renders a clean "not written yet" state (a short placeholder, not a blank screen or a hard error) for any nav entry whose file is missing. Ship with everything else live.

---

## 5. Layout plus UX spec (Mintlify-style, mobile-first)

### 5.1 Desktop (>=1024px) - three panes
- **Left sidebar (fixed, ~260px):** the nav tree from `prep.config.js`. Collapsible groups. Active page highlighted with the gold accent plus a 2px gold left-border. Scrolls independently.
- **Center (max ~720-760px reading width, centered):** rendered Markdown. Breadcrumb at top (Group / Page). Prev/Next pager at the bottom.
- **Right "On this page" (fixed, ~220px):** auto-built from the page's H2/H3. Scroll-spy highlights the current section in gold. Hidden below 1280px.
- **Top bar (sticky):** gold "B" logo mark (links to Overview), "Interview Prep" title in Anton, and a search box (focusable with `/`).

### 5.2 Mobile (<768px) - the priority
- **Top bar (sticky):** hamburger (left, >=44px target), title (center), search icon (right). Tapping the hamburger slides the sidebar in as a full-height drawer over a scrim; tapping a page closes it.
- **Content:** full width, ~16-20px side padding, base font ~16-17px, line-height ~1.6, line length capped ~68-72ch. Generous tap targets (Fitts's law, which the primer covers).
- **On this page:** collapses into a tappable "On this page" disclosure under the page title, or is omitted on the smallest screens. Do not crowd the column.
- **Prev/Next:** large stacked tap cards at the bottom.
- **No horizontal scroll, ever.** Tables scroll inside their own container; code blocks wrap or scroll internally.

### 5.3 Components to build
- Sidebar nav with collapsible groups plus active state.
- Breadcrumb.
- On-this-page TOC with scroll-spy.
- Prev/Next pager (order from `prep.config.js`).
- Client-side search: full-text index of headings plus body across all pages at load; show title plus matching heading; "/" to focus on desktop; full-screen overlay on mobile. At roughly a dozen pages a runtime index is fine; no prebuild needed.
- Callout / admonition blocks (Note, Tip, Warning) rendered as the design system's frosted-glass gold cards. Support the markdown convention `> [!NOTE]` / `> [!TIP]` / `> [!WARNING]` (the candidate profile already uses `> [!NOTE]`).
- The vertical "You as the Product" process diagram (SS4.4).
- Heading anchors (hover-reveal link icon on desktop; tappable on mobile) for deep links.
- Tables (hairline borders), code blocks (JetBrains Mono), PDF/asset links rendered as download cards.
- "Last updated" stamp per page (from front-matter `updated`, or the file mtime).

### 5.4 Routing
Hash routing (`/prep/#/you/you-as-the-product`) is simplest on Apache with no rewrites and survives Basic Auth cleanly. The repo uses real-folder, path-based routing with no rewrites today, so hash routing for the `/prep` SPA avoids touching server config. Recommend hash routing.

### 5.5 Front-matter
Support optional YAML front-matter in each `.md` (`title`, `group`, `order`, `updated`). If present it overrides `prep.config.js`; if absent, fall back to the config plus first H1. `Candidate-Profile-Barton.md` already ships with front-matter as the reference pattern.

---

## 6. Design system usage

Source of truth: `../DESIGN_SYSTEM.md` and the repo's `styles.css` `:root`. Do not invent new styling. Pull the `:root` block from the existing `styles.css` rather than retyping values, to avoid drift.

1. **Tokens (verbatim from the repo `styles.css`, current values):**
   ```css
   --bg:#101010; --surface:#141414; --surface-2:#1A1A1A; --line:#262626;
   --gold:#F8B828; --gold-dim:#C9941F; --gold-hi:#FFC945;
   --white:#FFFFFF; --muted:#8A8A8A; --muted-2:#5E5E5E;
   --green:#37D67A; --red:#E0564B; --amber:#E0A23B;
   /* plus gold alpha steps --gold-08..--gold-40, radii, glass, nav, easing */
   ```
   **Exactly one accent (gold).** Green/red/amber are functional status only.
2. **Type (match the page you are parallel to, which is root and `/quiz`):**
   - Display: **Anton** (page titles, section headers, logo). `--display:'Anton','Arial Narrow',sans-serif`.
   - Body/UI: **Montserrat**. `--body:'Montserrat',system-ui,...`. NOTE: `DESIGN_SYSTEM.md` says "Archivo," but the live root and `/quiz` ship **Montserrat**; only `/app` uses Archivo. Use **Montserrat** so `/prep` matches root and `/quiz`. Load via the same Google Fonts link the root uses.
   - Mono: **JetBrains Mono** (eyebrows, labels, code, system voice). Eyebrow pattern: mono, ~12px, `letter-spacing:.22em`, uppercase, gold.
3. **Surfaces:** hairline 1px borders, frosted-glass cards for callouts, minimal shadows. Radii from tokens: cards `--r-card:16px` / `--r-card-lg:18px`, controls `8-10px`, pills `20px`.
4. **Motion:** subtle scroll reveal is fine. The cursor-following gold blob background (`#bgfx`) from the resume is **optional and should be very subtle or off** in `/prep`; readability of long text beats spectacle here. Respect `prefers-reduced-motion`.
5. **House rules (enforce in any copy you write, and via the SS4.2 normalization on sources):** no em dashes, no italics, one gold accent, sentence-case body, mono for systemy microcopy, no overclaiming.
6. **6.6 PWA (recommended for phone use):** add a `manifest.webmanifest` plus the apple-touch meta so Barton can "Add to Home Screen." Copy the `/quiz` pattern: `display:standalone`, `theme/background #101010`, noindex meta, the apple-mobile-web-app tags. CAVEAT: `/quiz`'s manifest points its icon at `favicon.svg` only, and iOS ignores SVG apple-touch icons, so the home-screen icon is a weak fallback. If Barton wants a real home-screen glyph, add one PNG (gold "B" on #101010, 180x180 and 512x512); otherwise copying `/quiz` verbatim is acceptable. A service worker for offline reading is optional (subway-proof), not required.

---

## 7. Privacy plus access implementation (locked: private)

The most important non-UI requirement. Two locked layers: protect the live site (Basic Auth plus noindex), and keep the source private (the repo is private). Neither `.htaccess` nor `robots.txt` exists in the repo yet; you create both.

### 7.1 Live site (LOCKED)
- **HTTP Basic Auth on `/prep`** via `.htaccess` plus `.htpasswd` (SiteGround/Apache). Gate the whole directory. Barton sets the credentials on the server (do not commit them).
  ```apache
  # /prep/.htaccess  (do NOT commit the .htpasswd; create it on the server)
  AuthType Basic
  AuthName "Interview Prep"
  AuthUserFile /home/<siteground-account>/.htpasswd_prep
  Require valid-user
  ```
- **Noindex:** `<meta name="robots" content="noindex,nofollow">` in the shell (match `/quiz`, which already does this), plus add `Disallow: /prep` to a site `robots.txt` at the web root (create it; none exists).
- **Not linked** from the public resume root, `/app`, or `/quiz`. `/prep` is reachable only by typing the URL, then the password.

### 7.2 Source / repo (LOCKED: private)
The GitHub repo is **private**. That closes the github.com exposure, so the prep content (dossiers, candidate profile, strategy) and this PRD can be committed normally and ride the existing FTPS auto-deploy. No gitignore juggling, no manual SFTP step.

- Do **not** make the repo public again while the prep content lives in it.
- The `.htpasswd` lives on the server only; it never goes in the repo.
- **A private repo does not protect the live URL.** The Basic Auth plus noindex in SS7.1 are still required and independent of repo visibility. Private repo hides the source; Basic Auth gates the live page. You need both.

<!-- BUILD-NOTE: Flipping the GitHub repo to Private is a manual action Barton does in GitHub settings. The build cannot do it. SS10 checks for it. -->

---

## 8. Deploy (extends the existing pipeline)

Same mechanism as the rest of the repo: push to `main` -> GitHub Action -> FTPS sync to SiteGround (`.github/workflows/deploy.yml`, action `SamKirkland/FTP-Deploy-Action@v4.4.0`, protocol ftps, port 21).

- **Docroot:** `server-dir` is `/fieldflo.bartosuerte.com/public_html/`; `/prep` lands at `public_html/prep/`.
- **No build step** (Option A). If you choose Option B you must add a build stage before the FTPS step; prefer A.
- **Cache-bust:** link assets as `prep.css?v=1`, `app.js?v=1`, `prep.config.js?v=1`. **Bump `?v=N` on every change.** This is the repo's #1 "works locally, stale live" bug. For reference, the live root is already at `?v=8`; your `/prep` assets are new so start at `v=1` and bump from there.
- **Case-sensitive filenames** on the server. Match exactly (note `content/` filenames vs nav slugs).
- **Git runs on Barton's Mac, not in Cowork.** The sandbox cannot git this Google Drive folder (`.git` perms fail on the mount). Hand Barton the exact `git add/commit/push` commands; do not assume you can commit from here.
- **Secrets:** never commit `.htpasswd` or any key. The existing Action injects `ANTHROPIC_API_KEY` into `app/claude-proxy.php` for `/app`; `/prep` needs no secrets (do not add server-side search).
- **Deploy excludes (verbatim from `.github/workflows/deploy.yml`):**
  ```
  **/.git*
  **/.git*/**
  **/.github/**
  **/README.md
  **/CLAUDE.md
  **/PRD.md
  **/DESIGN_SYSTEM.md
  **/.DS_Store
  **/.gitignore
  app/claude-proxy.example.php
  ```
  So this PRD, any README, and `DESIGN_SYSTEM.md` are excluded automatically. `prep/content/*.md` is NOT excluded and WILL deploy via FTPS, which is what you want: the client renderer fetches those `.md` at runtime.

---

## 9. Build plan (phased, actionable)

1. **Scaffold** `/prep/`: `index.html` shell, `prep.css` (import tokens from the repo `styles.css`), `prep.config.js`, `app.js`, `lib/` (vendored `marked` plus `DOMPurify`, pinned), `content/`, and copy `favicon.svg` in (it is missing from `/prep`).
2. **Nav plus render:** implement `prep.config.js` (the tree in SS4), the md fetch plus render, hash routing, and the sidebar. Get one real page (the candidate profile) rendering end to end.
3. **Docs chrome:** breadcrumb, on-this-page TOC plus scroll-spy, prev/next, heading anchors, callouts (`> [!NOTE]`), tables, code, PDF download cards.
4. **The "You as the Product" diagram** (SS4.4): the vertical process flow at the top of the candidate page.
5. **Search:** runtime full-text index over all pages; desktop `/` focus plus mobile overlay.
6. **Mobile pass:** hamburger drawer, tap targets, type scale, no horizontal scroll. Test on a real phone, portrait, one-handed.
7. **Design-system pass:** tokens, Anton/Montserrat/JetBrains Mono, frosted callouts, subtle/optional motion, reduced-motion. Match root and `/quiz`.
8. **Privacy:** `.htaccess` Basic Auth, noindex meta, `robots.txt` Disallow, confirm the repo is private (SS7).
9. **Content load:** copy each source `.md` into `content/` per SS4.1, running the SS4.2 normalization pass; write `overview.md`; render graceful empty states for the two optional pages.
10. **PWA:** manifest plus apple-touch meta (copy `/quiz`; add a PNG icon if you want a real home-screen glyph).
11. **Deploy plus QA:** cache-bust, hand Barton the git commands (he pushes on his Mac); content deploys via FTPS automatically; then run SS10.

---

## 10. Acceptance criteria

- [ ] `https://fieldflo.bartosuerte.com/prep` prompts for a password (Basic Auth) and is `noindex`.
- [ ] After auth, the docs shell loads with the sidebar nav from `prep.config.js`.
- [ ] Every page mapped in SS4.1 renders from its `.md` with correct headings, tables, and code.
- [ ] The "You as the Product" page renders the vertical process diagram plus the candidate content.
- [ ] On-this-page TOC is auto-built and scroll-spy tracks the active section.
- [ ] Search returns full-text results across all pages and jumps to the page/heading.
- [ ] **Mobile:** hamburger drawer works; no horizontal scroll; tap targets >=44px; body text comfortable one-handed; tested on a real phone.
- [ ] Prev/Next pager follows `prep.config.js` order.
- [ ] Look matches the design system (gold accent, Anton/Montserrat/JetBrains Mono, hairlines, frosted callouts); no em dashes or italics in rendered copy (sources normalized per SS4.2).
- [ ] The two optional pages (JD Deep Dive, Corey) render a clean "not written yet" state and do not break nav.
- [ ] `/prep` is not linked from the public site; `robots.txt` disallows it.
- [ ] The GitHub repo is **private**; no credentials (`.htpasswd`, API keys) are committed.
- [ ] Adding a new page is dropping a `.md` plus one `prep.config.js` line (verify by adding a stub).
- [ ] Existing `/`, `/app`, `/quiz` still work, untouched.

---

## 11. Guardrails / house rules

- **Privacy first.** When in doubt, gate it and de-index it. Never link `/prep` publicly.
- **No em dashes, no italics, one gold accent.** Enforce in copy you write and via the SS4.2 normalization of sources.
- **Honest positioning.** This content trades on accuracy over hype (SS3.5). Do not let any copy you write (Overview, microcopy) inflate Barton's title or experience.
- **Content lives in Markdown**, not HTML. `prep.config.js` is the only nav source.
- **Bump `?v=N`** on every asset change.
- **Never commit** `.htpasswd` or API keys. Keep the repo **private**.
- **Edit surgically.** Do not refactor or restyle the existing `/`, `/app`, `/quiz` while adding `/prep`.
- **Git is run by Barton on his Mac**, not from Cowork.

---

## 12. Resolved decisions (formerly open questions)

All prior open questions are resolved so nothing blocks you. Defaults below are final unless Barton says otherwise.

1. **Search scope:** full-text (headings plus body). Resolved: full-text.
2. **PWA / offline:** manifest yes; service worker optional (skip unless cheap).
3. **Light mode:** dark-only, matching the system.
4. **Corey dossier and JD Deep Dive:** not written; render graceful empty states; non-blocking (SS4.5).
5. **HR screen page:** keep as retrospective reference (the screen with Christina is done); place under "You."
6. **"You as the Product" diagram:** build the SS4.4 vertical Double Diamond structure; confirm against Barton's uploaded diagram if/when provided.
7. **Retention:** after the interviews, keep `/prep` as a private template for future loops. No action now.

---

## 3.5 Project context (session end-results, for voice and accuracy)

Orientation so the copy you write lands in the right voice and never misstates a fact. The full content is in the SS4 files; this is the distilled briefing.

**Framing rule (important): the company is FieldFlō. "FlōTime" is just ONE of its product modules (time tracking and payroll).** Never call the company FlōTime. The "Flō" suite is a naming convention across modules.

**Company.** FieldFlō is AI-native vertical SaaS for specialty subcontractors, built by former DA&R subcontractors, "built by contractors for contractors." Legal entity The Maker System, LLC. Backed by Mainsail Partners (roughly $35M, Oct 2025). Core market DA&R (Demolition, Asbestos Abatement, Environmental Remediation); five marketed verticals add Masonry and Concrete. One platform, roughly 13 modules (Project Management, Safety, Dashboard/Reports, T&M Tracking, CRM, FlōTime = Time Tracking and Payroll, Inventory/Warehouse, Training and Cert Tracking, HR and Skill Tracking, Scheduling, Job Costing, Form Builder, Document Management). Design north star: accessibility that "transcends age, language, education, and technical expertise." Integrates with (does not replace) ERPs (Sage, QuickBooks, Acumatica, Viewpoint Vista, Foundation, COINS). Headline ROI claim ~$79K average annual savings (marketing claim). Per the JD/LinkedIn: founded 2016, HQ Denver CO, 11-50 employees.

**Competitive.** Wedge is "specialized and consolidated": more vertical than Procore, broader than point tools. Best-funded adjacent threat is BuildOps (AI-native, ~$1B). The designer's angle: the category's chronic failure is field adoption, and FieldFlō's reason to exist is the inverse, usability for older, multilingual, lower-digital-literacy crews. The live design problem is extending FlōTime's near-zero-friction sign-in standard across all modules.

**Role.** Senior Product Designer, $120K-$140K OTE, remote/hybrid, US-only, no sponsorship, several excluded states (Barton in Chattanooga TN is eligible). Team: Corey is Lead Product Designer and the hiring manager (Kansas); Atul Kalantri is CPO (Texas). The JD asks for one example of designing for AI components, multi-role workflows, or real-world complexity; Barton brings all three.

**Candidate (Barton).** See `Candidate-Profile-Barton.md` for the full self-as-product page. North star: the AI-native designer who ships. Real title Graphic and Web Designer, 15+ years, builds in Webflow moving to a Claude Code workflow. Strongest proof: the self-built Applicant Review Tool (`/app`), then the Humble and Fume rebuild (+20% online sales). Honest-positioning rule is absolute: never inflate title, product-design tenure, B2B SaaS experience, or AI fluency.

**Interviewer: Atul Kalantri (CPO).** Engineer-turned-product-exec (IBM/Infosys/TCS, then Olivia acquired by Nubank, DISCO, ServiceTitan, FieldRoutes). Built field-service vertical SaaS for the trades twice. Lens: exec altitude, judgment, ownership, AI-thesis fit, whether you raise a small team's output, not craft minutiae (likely Corey's lane). Language: "thinks in hours and days, not weeks and quarters," "force multiplier." How Barton wins him honestly: one undeniable piece of working software in his own language (the Tool), explained with specific AI-UX tradeoffs. He detects fluff in one follow-up.

**Strategy.** Loop: HR screen (Christina, done) -> Atul -> ~2hr case study -> panel. Throughline: never lie, never volunteer a weakness unprompted, always trade on the AI-nativeness everyone else fakes. Case-study runbook: roughly 1.5hr on interaction/UX, 0.5hr on FF-aesthetic polish; keep a live decision log to answer the three questions (process, problem understanding, solution rationale); lean on Claude for breadth then say where judgment overrode it.

**Design fundamentals primer.** Gives Barton the language and process spine for what he already does: Norman, Nielsen's 10 heuristics, Rams' 10 principles, Laws of UX, Krug, the Double Diamond, and the AI-native thesis that fundamentals are the moat (AI shifts value from making to deciding; taste and edge/error/offline states stay human).

---

## 13. Reference

- Design system, brand voice, tokens: `../DESIGN_SYSTEM.md` and the repo `styles.css` `:root`.
- Existing build/deploy conventions and gotchas: `../fieldflow.bartosuerte.com/README.md`, `CLAUDE.md`, and the repo's main `PRD.md` (the resume plus tool consolidation).
- Deploy workflow: `.github/workflows/deploy.yml` (FTPS to SiteGround).
- Project background and honest-positioning rules: `../PROJECT_MEMORY.md`.
- Content sources: the `.md` and `.pdf` files in `../` per SS4.1, including `Candidate-Profile-Barton.md` (created this session) and the `About FieldFlo/` folder.
- Reference sub-paths to match in look and behavior: `/app` (tool) and `/quiz` (docs PWA pattern).
