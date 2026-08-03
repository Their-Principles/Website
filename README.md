# Their Principles — Website

Private-membership website for Their Principles (Miami, Est. 2026). Plain
HTML/CSS/JS — no build step, no framework, no dependencies to install.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Landing page: hero, stats, Recent Moments gallery, story, experiences, calendar, four-panel directory, application CTA |
| `about.html` | Story, positioning, audience, values |
| `application.html` | Membership application — invitation and general paths (`?type=invited` / `?type=general`) |
| `contact.html` | Contact form + press/partnership inquiries |
| `members.html` | Member access (demo state — no real authentication yet) |
| `mentors.html` | Mentor roster (placeholder entries) |

## Running it locally

Nothing to install. From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Serving matters: the mentor grid loads
`content/mentors.json` via `fetch()`, which browsers block on `file://`.)

## Where things live

```
css/
  variables.css    ← brand tokens: colors (incl. muted gold), fonts, spacing, motion
  base.css          reset, typography, buttons, forms, selection, focus states
  layout.css        page width, section rhythm, split grids
  components.css    nav, hero, stats, gallery, story, experiences, calendar,
                    directory panels, CTA, footer
  pages.css         subpage compositions (about/application/contact/members/mentors)
  responsive.css    all breakpoint overrides (375 → 1440+)

js/
  navigation.js     scroll-aware hide/reveal nav, mobile menu, page transitions
  gallery.js        Recent Moments continuous photo strip (+ its image list)
  experiences.js    hover/scroll image reveals for experience rows + directory panels
  events.js         ← EVENTS + STATS DATA — edit this file to update the calendar
  forms.js          application/contact/login validation and submission
  mentors.js        renders content/mentors.json

content/mentors.json   mentor roster (editable without touching code)
assets/images/         event photography (see below) — currently empty
```

## How to update events

Open `js/events.js` and edit the `events` array at the top. Each entry:

```js
{
  title: "Game Night with BS Miami",
  date: "2026-07-09",        // YYYY-MM-DD
  time: "8:00 PM",
  location: "Pamplemousse On The Bay",
  image: "",                  // path under assets/images/events/…
  url: "",                    // the event's Luma registration link
  status: "",                 // e.g. "open" for upcoming events
  category: "Game Night"
}
```

The calendar sorts chronologically and splits Upcoming/Past automatically.
Member/event counts live in `communityStats` in the same file — never
hard-code numbers in the HTML.

## How to connect Luma later

`js/events.js` contains a clearly marked `fetchLumaEvents()` adapter stub.
When an official Luma data source or backend endpoint is approved, implement
it to return an array shaped like `events`, then swap it in. Nothing about
the calendar's HTML needs to change. There is currently **no** working Luma
integration — the calendar renders from the local data above.

## How to replace images

Photos live in `assets/images/`. Current contents:

- `padel/` — 18 photographs from the padel event on 1 August 2026 at Epic
  Athletic Club (listed on Luma as "July Pass"). These are the real archive.
- `venues/` — two photographs of Pamplemousse On The Bay, used only as
  atmospheric backgrounds on two directory panels.

Where each set is referenced:

1. **Recent Moments gallery** — the `PHOTOS` list at the top of
   `js/gallery.js`. Each entry needs `src`, the file's real pixel `w`/`h`
   (these set the tile's shape and stop the layout shifting while it loads),
   an `alt` description, and a `caption` naming the event it actually came
   from. Add landscape and portrait photos alternately: the list is split
   into two rows down the middle, so alternating keeps both rows mixed.
2. **Directory panels** — the four `--panel-image` lines in the
   "DIRECTORY PANEL IMAGERY" block at the top of `css/components.css`.
   That block is the only place those photos are set.
3. **Experience rows** — the `data-image` attributes in `index.html`.
4. **Hero / members page** — the CSS variables noted in the TODO comments in
   `index.html` and `members.html`.

Photos are resized to ~1200px on the long edge and saved as progressive JPEG
at quality ~76 (roughly 120–220 KB each). Keep new files in that range.

## How to connect the application & contact forms

`js/forms.js` has an `ENDPOINTS` object at the top with empty values. Create
forms at formspree.io (or any POST endpoint) and paste the URLs there. Until
then, submissions validate locally and show the success state without
sending anywhere.

## How to connect member authentication

There is none yet. `members.html` shows an honest "access not open yet"
state after validating an email. When a member system is chosen, replace the
handler marked `DEMO ONLY` in `js/forms.js`.

## Content still pending (search the code for `TODO(client)`)

- Photography for every event other than padel. The Recent Moments gallery
  currently shows only the 1 August padel event, so every caption there reads
  "Padel Experience". Game Night with BS Miami, The War for Your Attention
  with Andrés Preschel, This Summer We Create, and the Mentorship Experience
  with Moshe Mana all still need photos before the archive feels complete.
- Photography for the hero and the experience rows
- Exported vector logo (the mark is currently a typographic lockup)
- Real mentor roster in `content/mentors.json`
- Mentorship Experience with Moshe Mana — date/time/location for the calendar
- Luma registration URLs per event
- Instagram profile URL (footer + contact page)
- Form endpoints (application + contact)
- Member authentication

## Git

`main` holds the current version. The pre-refinement build is preserved in
the initial commit ("Backup: initial site build").
