# Portfolio Website — Nico Salim

A static portfolio website (pure HTML, CSS, and JavaScript) ready to deploy on Vercel.

## Page structure

1. **Home** — hero with looping typing animation, cutout profile photo, cursor-following glow, and a Download CV button
2. **About** — "Who am I?" card, quick education/specialization info, and a contact CTA card
3. **Education & Achievement** — tab toggle: education history & certifications/webinars
4. **Works** — 3-slot carousel: a looping showcase video, a real workplace photo, and an "Open to Work" slot
5. **My Skills** — tab toggle: Hard Skills (Hardware / Software / IT Consultant / Development cards) and Soft Skills (progress bars)
6. **Contact** — form connected to FormSubmit + contact info

There's also a **theme toggle button** (bottom-right) to switch the accent color between green and blue, saved automatically in the browser (localStorage).

## 1. Opening & editing in VS Code

1. Open this folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.

## 2. Things you might still want to adjust

- **Profile photo** (`assets/profile.png`) — background already removed via image processing. Swap the file anytime (keep the same filename) to update it.
- **Work video** (`assets/content-growth.mp4`) — plays muted, autoplay, and loops automatically in the browser.
- **Work photos** (`assets/pt-shamrock.jpeg`, `assets/work-in-progress.png`) — replace anytime with the same filename.
- **CV file** (`assets/Nico-Salim-CV.pdf`) — this is what downloads when someone clicks "Download CV". Replace with an updated CV anytime, same filename.
- **Blue theme color** — defined in `style.css` under the `html[data-theme="blue"]` block.

## 3. Deploying to Vercel

**Option A — via GitHub (recommended):**
1. Push this folder to a new GitHub repository.
2. Go to [vercel.com](https://vercel.com) → New Project → Import that repo.
3. Framework preset: **Other**, leave build command empty, output directory `.`.
4. Deploy.

**Option B — via Vercel CLI:**
```bash
npm i -g vercel
cd portfolio
vercel
```

## 4. File structure

```
portfolio/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── profile.png            → profile photo (background removed)
│   ├── content-growth.mp4     → looping showcase video (Work slot 1)
│   ├── pt-shamrock.jpeg       → workplace photo (Work slot 2)
│   ├── work-in-progress.png   → placeholder image (Work slot 3)
│   └── Nico-Salim-CV.pdf      → downloadable CV
└── README.md
```

## 5. Contact form notes (FormSubmit)

The form is set to send to `nicolim1131@gmail.com`. After the site goes live and the form is submitted once, FormSubmit sends a **confirmation email** — click the link in that email once. After that, every message submitted goes straight to your inbox automatically.
