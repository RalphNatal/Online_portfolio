Screenshots for "Hawaii Booths Landing Page"
==========================================

Drop images for this project here:

  cover.webp   card cover, about 1600x1000 (16:10 works best)
  1.webp       extra screenshots shown in the project modal
  2.webp
  ...

Then point to them in js/projects.js (entry with slug "hawaii-booths"):

  cover: 'assets/projects/hawaii-booths/cover.webp',
  images: [
    { src: 'assets/projects/hawaii-booths/1.webp', alt: 'What the screenshot shows', width: 1600, height: 1000 },
  ],

Until "cover" is set, the site shows a generated placeholder cover.

Have PNG/JPG originals instead? Put them in assets/originals/projects/hawaii-booths/
and run:  npm i --no-save sharp && node tools/optimize-images.cjs
It writes optimized WebP files into this folder and prints their sizes.

Don't include private data in screenshots (API keys, bundle/app IDs,
emails, phone numbers, IP addresses, real customer data).
