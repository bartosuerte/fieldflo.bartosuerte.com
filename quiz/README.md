# /quiz — FieldFlō interview rehearsal quiz

A private, mobile-first quiz built from the two interview prep PDFs
(`FieldFlo-Cheat-Sheet.pdf` + `FieldFlo-Interview-Strategy.pdf`).
Styled with the Bartosuerte Design System, on the **softened-black** canvas
(`--bg:#101010`, matching the rest of the site and the portfolio).

## What it is
- **Self-contained:** everything (CSS, JS, the 41-question bank) is inline in
  `index.html`. No build step, no dependencies, no network calls beyond Google
  Fonts. It runs offline once loaded.
- **7 decks / 41 questions:** Money Answers, Three Pillars, Gap Playbook,
  Lead/Neutralize/Never, Interview Q&A, LinkedIn Reality Check, Close & Principles.
- **Two formats:** multiple choice (auto-graded, with explanation + source line)
  and "rehearse out loud" cards (reveal beats + model answer, then self-grade).
- **Tracks progress** in `localStorage` (best/last score per deck, missed-question
  review, settings). Nothing leaves the device.

## Run locally
Any static server from the repo root, e.g.:
```
python3 -m http.server 8099
```
then open `http://localhost:8099/quiz/`. Or just open `index.html` directly.

## Publish
It is a plain static folder, so it deploys with the rest of the site to
`https://fieldflo.bartosuerte.com/quiz`. Relative links (`favicon.svg`,
`manifest.webmanifest`) resolve under `/quiz/` automatically. It does **not**
depend on the resume's `styles.css`, so no `?v=` cache-bust is needed here.
`robots` is set to `noindex` so it stays unlisted.

## On a phone
Open the URL, then **Share → Add to Home Screen**. The web manifest +
`apple-mobile-web-app` meta make it launch full-screen like an app.

## Editing the questions
The bank lives in the single `<script id="quiz-bank" type="application/json">`
block in `index.html`. Edit that JSON to add, fix, or remove questions.
