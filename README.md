# sec-portfolio

A CTF-themed personal portfolio. Terminal windows, a boot sequence, blue/red instead of
the usual green-on-black hacker cliché, and a hero terminal you can actually type into.

No frameworks, no build step. Open `index.html` and it works.

**Live site:** _add your deployed URL here_

---

## Why this exists

Most "cybersecurity portfolio" templates look the same — green text, a hoodie photo, a
list of buzzwords. This is my attempt at something that actually feels like a CTF: a real
competition log pulled from CTFtime, an interactive terminal instead of a static hero
image, and content that doesn't pretend I've disclosed CVEs I haven't found.

## Features

- Boot sequence on page load
- Interactive hero terminal — click it and type. Supports `help`, `whoami`, `ls`,
  `cd <section>`, `ctf`, `contact`, `date`, `clear`, and a few commands that aren't listed
  in `help` on purpose
- A couple of easter eggs (one of them needs the Konami code)
- CTF competition log with real scores/rating weights
- Working contact form (Formspree, see setup below)
- Fully custom CSS, no UI framework, no template

## Tech stack

Vanilla HTML, CSS, and JavaScript. That's it.

## Project structure

```
.
├── index.html
├── script.js
└── css/
    ├── base.css          variables, resets, global typography
    ├── effects.css        scanlines, noise, boot screen, matrix easter egg
    ├── layout.css          topbar, footer
    ├── hero.css            hero section, buttons, terminal window
    ├── sections.css        about, capability matrix
    ├── cards.css           challenge notes, CTF log table
    ├── contact.css         contact form and sidebar
    └── responsive.css      mobile breakpoints
```

## Running locally

No build step, no dependencies. Clone it and open the file:

```bash
git clone https://github.com/HexFud/sec-portfolio.git
cd sec-portfolio
open index.html   # or just double-click it
```

If you want a local server instead of `file://` (recommended, some browsers are picky
about local file access for fonts):

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Setting up the contact form

The form posts to [Formspree](https://formspree.io) — free, no backend required.

1. Create a free Formspree account and a new form
2. Copy your form ID
3. In `index.html`, find the `<form>` tag inside `#contact` and replace
   `YOUR_FORM_ID` in the `action` attribute:

```html
<form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Until you do this, the form will tell you it's not configured instead of pretending to
send anything.

## Deploying

Static site, deploys anywhere. GitHub Pages is the easiest option:

1. Push to a repo
2. Settings → Pages → deploy from the `main` branch, root folder
3. Done

Also works fine on Netlify, Vercel, or any static host — just point it at the repo root.

## Updating the CTF log

The competition table lives in `index.html` under `<section id="ctf">`. Each row is:

```html
<div class="log-row">
  <span>Event name</span><span class="result">score</span><span>rating weight</span>
</div>
```

Pull your numbers from [CTFtime](https://ctftime.org) and swap them in.

## AI Declaration

AI helped me to build the initial structure of the site 

