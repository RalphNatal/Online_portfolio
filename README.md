# Ralph Natal — Portfolio

Personal portfolio of **Ralph Lluewyne Natal**, a full-stack and mobile developer and UI/UX designer. It covers client apps (Flutter, React Native Web, Supabase, Stripe/PayPal), landing pages, security coursework and a graphic-design gallery.

It's a static site: plain HTML, CSS and vanilla JavaScript, with **no build step** and no framework.

```
index.html
css/styles.css           styles + light/dark theme tokens
js/projects.js           project data (edit this to add projects)
js/main.js               nav, theme, scroll reveal, project cards/filters/modal, gallery, lightbox
assets/                  optimized images (WebP), favicon, share image, fonts
assets/design/           design gallery images (+ thumbs/)
assets/projects/<slug>/  screenshots for each project
assets/originals/        full-size source images (gitignored)
tools/optimize-images.cjs  image optimizer (sharp)
```

## Run it locally

Pick one:

- **VS Code:** install the *Live Server* extension, right-click `index.html`, then **Open with Live Server**.
- **Terminal:** `npx serve .` and open the URL it prints.

Opening `index.html` directly from the file system also works.

## Add or edit a project

1. Open `js/projects.js` and copy an existing entry. The fields are documented at the top of the file.
2. Give the project a unique `slug` (kebab-case), set `category` (e.g. `['Mobile', 'Client work']`), and set `featured: true` if it should get a large card.
3. Create `assets/projects/<slug>/` and drop in screenshots:
   - `cover.webp`: card image, about 1600×1000
   - `1.webp`, `2.webp`, …: extra screenshots for the detail modal
4. Point to them in the entry:

   ```js
   cover: 'assets/projects/<slug>/cover.webp',
   images: [
     { src: 'assets/projects/<slug>/1.webp', alt: 'What it shows', width: 1600, height: 1000 },
   ],
   ```

Until `cover` is set, the card shows a generated placeholder (accent gradient, category icon and title). Links (`live`, `repo`, `playStore`, `appStore`) show up in the modal as soon as you fill them in. Use public URLs only.

Every project opens at its own URL, e.g. `#project/prayer-walk`.

## Swap or add images

Raw PNG/JPG files go in `assets/originals/` (this folder is gitignored, so originals stay on your machine):

| Put the original here | You get |
| --- | --- |
| `assets/originals/portrait.jpg` | `assets/ralph-natal-portrait.webp` (800px) and the share image |
| `assets/originals/design/<name>.png` | `assets/design/<name>.webp` (1600px) + `assets/design/thumbs/<name>.webp` (400px) |
| `assets/originals/projects/<slug>/<name>.png` | `assets/projects/<slug>/<name>.webp` (1600px) |

Then run:

```bash
npm i --no-save sharp
node tools/optimize-images.cjs
```

The script prints each output's width and height. Copy those into the `width`/`height` attributes in `index.html` (or `js/projects.js`) so the page doesn't shift while images load. Use lowercase-kebab-case file names, with no spaces.

To add a design to the gallery, copy one `<li>` in the `#design` section of `index.html` and update `data-full`, `data-width`, `data-height`, `data-title`, `data-description`, the thumbnail `src` and its `alt` text.

## Settings

- **Phone number:** set `SHOW_PHONE = false` at the top of `js/main.js` to hide it.
- **Share preview URL:** the Open Graph / Twitter tags in `index.html` assume GitHub Pages (`https://ralphnatal.github.io/Online_portfolio/`). Update them if you use another domain.

## Deploy

**GitHub Pages**

1. Push to `main`.
2. In the repo, go to **Settings → Pages**, set *Source* to **Deploy from a branch**, choose `main` / `/ (root)` and save.
3. The site goes live at `https://ralphnatal.github.io/Online_portfolio/`.

**Vercel**

1. **Add New → Project**, import the GitHub repo.
2. Framework preset: **Other**. Leave the build command empty and keep the output directory as the root.
3. Deploy. Every push to `main` redeploys automatically.

## Credits

- Fonts: [Space Grotesk](https://github.com/floriankarsten/space-grotesk) and [Inter](https://github.com/rsms/inter), self-hosted under the SIL Open Font License 1.1 (see `assets/fonts/`).
- Icons: inline SVG sprite in `index.html`, paths adapted from [Lucide](https://lucide.dev) (ISC License). Portions copyright Cole Bemis 2013–2022 as part of Feather (MIT); all other copyright Lucide Contributors 2022.
