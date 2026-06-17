# Bartosuerte Design System
*The personal brand system of William R. Barton — graphic & web designer. Used for the interactive resume (resume.bartosuerte.com) and the Applicant Review Tool (review.bartosuerte.com).*

## 1. Brand in one line
A dark, editorial-tech aesthetic: a near-black canvas, a single warm-gold accent, bold condensed display type, monospace technical labels, and frosted-glass cards floating over a slow gold gradient that follows the cursor. Confident, modern, lightly engineered — design-led but clearly built by someone who codes.

## 2. Voice & tone
- Direct, confident, honest. No fluff, no hype, no overclaiming.
- Microcopy that represents "the system speaking" (labels, status, eyebrows) is set in monospace and reads like a terminal: terse, lowercase or ALL-CAPS, technical.
- Body copy is plain and human, sentence case.
- **No em dashes.** Use a hyphen, comma, or period. (House rule.)
- Sparing punctuation; almost no exclamation points.

## 3. Color tokens
| Token | Value | Use |
|---|---|---|
| `--bg` | `#0B0B0B` | Page canvas (near-black) |
| `--surface` | `#141414` | Standard card / panel |
| `--surface-2` | `#1A1A1A` | Raised or inset surface, quote blocks |
| `--line` | `#262626` | Hairline borders, dividers (always 1px) |
| `--gold` | `#F8B828` | THE accent — brand, highlights, primary buttons, logo |
| `--gold-dim` | `#C9941F` | Darker gold for gradient stops |
| `--white` | `#FFFFFF` | Primary text |
| `--muted` | `#8A8A8A` | Secondary text |
| `--muted-2` | `#5E5E5E` | Tertiary text, placeholders |
| `--green` | `#37D67A` | Positive / success / "connected" |
| `--red` | `#E0564B` | Negative / error / gaps |

**Rule: exactly one accent color (gold).** Green and red are functional status only, never decorative. No second brand color, no rainbow data-viz.

### Glass (frosted cards)
- `--glass-bg: rgba(0,0,0,.25)` (black, low opacity — tune for see-through)
- `--glass-blur: blur(12px)` (backdrop blur)
- Used on tinted/floating cards so the moving gold field stays readable behind them.

## 4. Typography
| Role | Family | Notes |
|---|---|---|
| Display | **Anton** (Google) | UPPERCASE, condensed, tight leading. Big headlines, section titles, score numbers, logo letterform. |
| Body / UI | **Archivo** (Google, 400–900) | All running text, buttons, labels. Workhorse. |
| Mono | **JetBrains Mono** (Google, 400/500) | Eyebrows, status text, chips, quotes, "system voice" microcopy, code. |

Signature type patterns:
- **Eyebrow:** mono, ~12px, `letter-spacing:.22em`, UPPERCASE, gold.
- **Section title:** Anton, UPPERCASE, fluid `clamp(28px,4.6vw,46px)`, line-height ~1.
- **Body:** Archivo, ~15–16px, line-height 1.55, `--muted` for secondary.
- **Italics are replaced by monospace** (no italic type anywhere).

## 5. Spacing & shape
- Container max width: `1180px`; page gutter: `24px`.
- Section vertical padding: `74px` (token `--pad-section`); card inner padding: `24px`.
- Radii: cards `14–18px`, buttons/inputs `8–10px`, chips/pills `20px` (full).
- Borders: 1px `--line` hairlines. Shadows are minimal; depth comes from surface color + blur, not heavy drop shadows.

## 6. Core components
- **Buttons:** (a) solid gold + black text (primary); (b) gold outline + white text (secondary); (c) hairline "ghost" (tertiary). Subtle `translateY(-1px)` lift on hover.
- **Cards:** solid `--surface` cards with hairline border; OR frosted-glass cards (glass bg + blur + gold dashed/solid border) for "notes / AI / meta" callouts.
- **Chips / tags:** small mono pills, gold tint background, gold border.
- **Inputs / textareas:** `--bg` fill, hairline border, gold border on focus, mono text.
- **Score ring:** conic-gradient gold dial with count-up animation.
- **Skill bars:** thin track (`#202020`) with gold gradient fill that animates on scroll-in.
- **Logo:** gold "B" iso mark (square glyph), `fill: var(--gold)`.

## 7. Motion
- **Background:** 3–4 soft gold radial blobs that ease toward the cursor at *different* rates (staggered trailing), drifting slowly on their own when idle. `mix-blend-mode: screen`, heavily blurred, behind everything.
- **Scroll reveal:** fade + 20px rise as sections enter view.
- **Counters:** score ring and skill bars animate from 0 on reveal.
- **Respect `prefers-reduced-motion`.**

## 8. Do / Don't
- **Do:** lean on near-black space; one gold accent; mono for anything "systemy"; honest, concrete copy.
- **Don't:** add extra accent colors; use heavy drop shadows or glossy gradients; use em dashes; use italics; overclaim in copy.

## 9. Reference implementation
The Applicant Review Tool (`review.bartosuerte.com`) is the living reference. Its `styles.css` `:root` holds every token above; its components are the source of truth. Attach that folder (`index.html` + `styles.css`) to Claude Design as the code example.
