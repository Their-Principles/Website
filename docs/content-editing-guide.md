# Editing the Their Principles Website — No Coding Required

This guide is for Valeria, Rafaela, Camila, Augusto, or anyone on the team
updating the site's content without a technical background. You won't need to
install anything — everything below can be done in your browser on GitHub.com.

## The golden rule

**Only edit files inside the `content/` folder.** Those three files —
`calendar.json`, `carousel.json`, and `mentors.json` — hold everything that
changes regularly. Nothing else on the site should need to change for normal
updates. If you think you need to edit an `.html`, `.css`, or `.js` file, ask
a developer first.

## How to edit a file on GitHub.com

1. Open the repository on GitHub.
2. Click into the `content` folder, then click the file you want to change
   (e.g. `calendar.json`).
3. Click the pencil icon (top right of the file) to edit.
4. Make your change (see examples below).
5. Scroll down, add a short description of what you changed, and click
   **"Propose changes"** (this creates a branch + pull request automatically).
6. Ask a developer to review and merge it — or if you've been given merge
   access, merge it yourself once it looks right.

The site updates automatically once the change is merged and deployed.

## `content/calendar.json` — Upcoming Events

Each event looks like this:

```json
{
  "date": "2026-08-16",
  "title": "Padel & Rotation Night — Padel X Miami",
  "location": "Padel X · Miami",
  "status": "open"
}
```

- **date** — always `YYYY-MM-DD` format.
- **title** — shows as the event name.
- **location** — shows under the title.
- **status** — must be exactly one of: `"open"`, `"waitlist"`, or `"members"`.

To add a new event, copy an existing `{ ... }` block, add a comma after the
previous one, paste the new block, and edit its values. To remove an event,
delete its whole `{ ... }` block (and the comma before or after it, so the
list stays valid).

## `content/carousel.json` — Past-Event Photos

```json
{
  "image": "assets/images/carousel/dinner-01.jpg",
  "caption": "Dinner at Cecconi's, Soho House Miami"
}
```

- **image** — the path to a photo already uploaded into
  `assets/images/carousel/`. Upload photos there first (via GitHub's
  "Add file" button in that folder), then reference the filename here.
- **caption** — the short line shown over the photo.

## `content/mentors.json` — Mentor Profiles

```json
{
  "name": "Jane Doe",
  "affiliation": "Founder, Example Co.",
  "bio": "One or two sentences on what Jane brings to the room.",
  "photo": "assets/images/mentors/jane-doe.jpg"
}
```

Same pattern as above — upload the photo to `assets/images/mentors/` first,
then reference it by filename.

## A quick sanity check before saving

JSON is strict about punctuation. Before you save:

- Every `{` has a matching `}`.
- Every entry except the last one in a list ends with a comma.
- All text is wrapped in double quotes `"like this"`, not single quotes.

If you're not sure, paste your edited file into [jsonlint.com](https://jsonlint.com)
— it will tell you immediately if something's broken, before you publish it.
