# Their Principles — Website

Private-membership landing page for Their Principles (Miami). Plain HTML/CSS/JS —
no build step, no framework, no dependencies to install.

## Running it locally

There's nothing to install or build. Two options:

1. **Just open the file.** Double-click `index.html`. Everything works except the
   carousel/calendar/mentor grid, which load their content via `fetch()` and
   most browsers block `fetch()` on the `file://` protocol.
2. **Serve it locally (recommended).** From this folder, run:

   ```bash
   python3 -m http.server 8000
   ```

   Then open `http://localhost:8000` in your browser. This makes `fetch()` work
   so the calendar, carousel, and mentor grid all render correctly.

## Project structure

```
index.html                 Home page — the full landing page
mentors.html                Mentors subpage
css/
  variables.css             Brand colors, fonts, spacing — the source of truth
  base.css                  Reset + base typography
  components.css            Every section's styles (nav, hero, stats, etc.)
  pages.css                 Page-specific tweaks (mentors CTA banner, etc.)
js/
  nav.js                     Solid nav on scroll + mobile menu
  carousel.js                Past-events carousel (autoplay + controls)
  stats-counter.js           Animated member/event counters
  calendar.js                Renders content/calendar.json
  mentors.js                 Renders content/mentors.json
  form.js                    "Get to Know You" form validation + submit
content/                     ⚠️ Edit these to update the live site — see below
  calendar.json              Upcoming events
  carousel.json              Past-event photos
  mentors.json                Mentor bios
assets/
  images/                    hero/, carousel/, events/, mentors/ — all TODO, empty
  logo/                      TODO — no vector wordmark file exists yet
docs/
  content-editing-guide.md   Plain-language guide for non-technical editors
```

## Editing content (no coding required)

See [`docs/content-editing-guide.md`](docs/content-editing-guide.md). Short version:
almost everything you'll want to change day-to-day lives in the three files inside
`content/` — you can edit those directly on GitHub.com without installing anything.

## Outstanding TODOs before launch

Search the codebase for `TODO(client)` to find every spot that needs real input.
As of this build, that includes:

- Real photography for the hero, carousel, and each event type
- A vector logo file (SVG/PNG) — none was supplied; the wordmark is currently
  built from CSS/text, not an image
- Real mentor names, bios, and photos (`content/mentors.json`)
- A real Formspree endpoint for the "Get to Know You" form (`js/form.js`)
- The real destination for the "Apply" and "Secure Your Place" buttons
  (currently `href="#"`)
- Confirming the GitHub org/repo name before the first push (see below)

## Connecting this to GitHub

This folder is not yet a git repository. To connect it:

```bash
git init
git add .
git commit -m "Initial site build"
git branch -M main
git remote add origin https://github.com/Their-Principles/Website.git
git push -u origin main
```

Replace the remote URL if `Their-Principles/Website` isn't the confirmed org/repo name.
Suggested branch model: `main` (production) + `dev` (integration) + short-lived
`feature/*` branches per section, merged into `dev` first, then `dev` → `main` to deploy.

## Brand reference

Colors, fonts, and spacing all live in `css/variables.css` — that file is the
single source of truth for the brand system. Do not hardcode hex values or font
names anywhere else; reference the CSS variables instead.
