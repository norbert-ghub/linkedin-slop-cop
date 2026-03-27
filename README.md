# Human vs AI LinkedIn Quiz

This project is a standalone browser quiz game with 10 questions per run.

## What it does

- Shows one post at a time.
- Forces an answer before enabling `Next`.
- Uses two choices per question: `Human` or `AI`.
- Gives a final score out of 10.
- Randomizes each run so repeat plays feel fresh.
- Chooses a random AI/Human split each game (between 4-6 AI posts, rest Human).

## Files

- `index.html` - app structure.
- `styles.css` - UI styling.
- `app.js` - quiz logic + randomized post pool.

## Run

Open `index.html` in any browser.

## Optional: Use your own public-post dataset

In `app.js`, set `REMOTE_POSTS_URL` to a JSON endpoint returning an array like:

```json
[
  { "text": "...", "label": "human" },
  { "text": "...", "label": "ai" }
]
```

The app merges remote entries with fallback entries and randomizes a fresh 10-question quiz each play.
