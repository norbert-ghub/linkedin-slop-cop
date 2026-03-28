# Human vs AI LinkedIn Quiz

This project is a standalone browser quiz game with 10 questions per run.

## What it does

- Shows one post at a time.
- Forces an answer before enabling `Next`.
- Uses two choices per question: `Human` or `AI`.
- Gives a final score out of 10.
- Randomizes each run so repeat plays feel fresh.
- Chooses a random AI/Human split each game (between 4-6 AI posts, rest Human).
- Tracks seen post IDs in browser storage and prioritizes unseen posts in future rounds.

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
  { "id": "abc123", "text": "...", "label": "human", "confidence": 0.92, "source": "approved_feed" },
  { "id": "def456", "text": "...", "label": "ai", "confidence": 0.88, "source": "approved_feed" }
]
```

The app merges remote entries with fallback entries, filters low-confidence items, and randomizes a fresh 10-question quiz each play.

## Reliable + compliant approach

- Do not scrape LinkedIn directly from the browser app.
- Serve posts from your own backend that only includes content collected through compliant channels.
- Include `id`, `label`, and `confidence` for reliable filtering and anti-repeat behavior.

With the built-in large fallback pool and seen-history logic, users can usually play 5-10 rounds with low repeat probability.
