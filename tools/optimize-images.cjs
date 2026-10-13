/**
 * Image optimizer for the portfolio.
 *
 * Reads full-size originals from assets/originals/ (gitignored) and writes
 * compressed WebP files into assets/. Run it whenever you add or swap images:
 *
 *   npm i --no-save sharp
 *   node tools/optimize-images.cjs
 *
 * Conventions (file names should be lowercase-kebab-case):
 *   assets/originals/portrait.jpg              -> assets/ralph-natal-portrait.webp (800px)
 *   assets/originals/design/<name>.png|jpg     -> assets/design/<name>.webp        (1600px max)
 *                                              -> assets/design/thumbs/<name>.webp (400px max)
 *   assets/originals/projects/<slug>/<name>.*  -> assets/projects/<slug>/<name>.webp (1600px max)
 *
 * It also (re)generates the favicon set and the Open Graph share image.
 * At the end it prints each output's width/height so you can copy them into
 * the <img width height> attributes or js/projects.js.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const ORIG = path.join(ROOT, 'assets', 'originals');
const OUT = path.join(ROOT, 'assets');
const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const QUALITY = 80;

const results = [];

async function toWebp(src, dest, maxEdge) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const info = await sharp(src)
        .rotate() // respect EXIF orientation
        .resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(dest);
    results.push({ file: path.relative(ROOT, dest).replace(/\\/g, '/'), width: info.width, height: info.height, kb: Math.round(info.size / 1024) });
}

function listImages(dir) {
    return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => IMAGE_RE.test(f)) : [];
}

const BRAND_SVG = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2563EB"/>
      <stop offset="1" stop-color="#6D28D9"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <text x="32" y="42" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif"
        font-size="28" font-weight="700" fill="#fff" letter-spacing="-1">RN</text>
</svg>`;

async function favicons() {
    fs.writeFileSync(path.join(OUT, 'favicon.svg'), BRAND_SVG(64).trim() + '\n');
    await sharp(Buffer.from(BRAND_SVG(32))).png().toFile(path.join(OUT, 'favicon-32.png'));
    // Apple touch icons should not be transparent: render on a solid square.
    await sharp(Buffer.from(BRAND_SVG(180).replace('rx="14"', 'rx="0"'))).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
}

async function ogImage() {
    const portrait = path.join(ORIG, 'portrait.jpg');
    if (!fs.existsSync(portrait)) return;
    const W = 1200, H = 630, P = 470;
    const photo = await sharp(portrait).rotate().resize(P, P, { fit: 'cover', position: 'top' })
        .composite([{ input: Buffer.from(`<svg width="${P}" height="${P}"><rect width="${P}" height="${P}" rx="40" fill="#fff"/></svg>`), blend: 'dest-in' }])
        .png().toBuffer();
    const bg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B1120"/>
      <stop offset="1" stop-color="#1E3A8A"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="70" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="68" font-weight="700" fill="#fff">Ralph Natal</text>
  <text x="70" y="320" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="#93C5FD">Full-Stack &amp; Mobile Developer</text>
  <text x="70" y="368" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="#93C5FD">UI/UX Designer</text>
  <text x="70" y="450" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#CBD5E1">Mobile apps · Booking &amp; payment systems</text>
  <text x="70" y="486" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#CBD5E1">Ordering apps · Landing pages</text>
</svg>`;
    await sharp(Buffer.from(bg))
        .composite([{ input: photo, left: W - P - 70, top: (H - P) / 2 }])
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(path.join(OUT, 'og-image.jpg'));
    results.push({ file: 'assets/og-image.jpg', width: W, height: H, kb: Math.round(fs.statSync(path.join(OUT, 'og-image.jpg')).size / 1024) });
}

(async () => {
    // Hero portrait
    const portrait = path.join(ORIG, 'portrait.jpg');
    if (fs.existsSync(portrait)) await toWebp(portrait, path.join(OUT, 'ralph-natal-portrait.webp'), 800);

    // Design gallery: full size + thumbnail
    for (const f of listImages(path.join(ORIG, 'design'))) {
        const name = path.parse(f).name;
        const src = path.join(ORIG, 'design', f);
        await toWebp(src, path.join(OUT, 'design', `${name}.webp`), 1600);
        await toWebp(src, path.join(OUT, 'design', 'thumbs', `${name}.webp`), 400);
    }

    // Project screenshots
    const projDir = path.join(ORIG, 'projects');
    if (fs.existsSync(projDir)) {
        for (const slug of fs.readdirSync(projDir)) {
            for (const f of listImages(path.join(projDir, slug))) {
                await toWebp(path.join(projDir, slug, f), path.join(OUT, 'projects', slug, `${path.parse(f).name}.webp`), 1600);
            }
        }
    }

    await favicons();
    await ogImage();

    console.table(results);
})();
