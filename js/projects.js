/* ============================================================
   PROJECT DATA
   ------------------------------------------------------------
   Every project card and detail modal on the site is rendered
   from this array — add a project by adding an object here.

   Fields
     slug        unique, kebab-case; also the image folder name
                 (assets/projects/<slug>/) and the URL hash (#project/<slug>)
     title       project name
     client      client / context line (optional)
     category    any of: "Mobile", "Web", "Client work", "Security",
                 "Design/UI", "Game" — the first one is the primary
                 category (used for sorting and the placeholder icon)
     featured    true = large card at the top of the Projects section
     group       "coursework" puts it under "Security & coursework"
     status      short badge text, e.g. "Live on Google Play" ('' = no badge)
     year, role
     summary     1–2 sentences for the card
     overview    paragraph for the detail modal
     features[], highlights[], stack[]
     links       { live, repo, playStore, appStore } — public URLs only
     cover       path to a cover image; '' = generated placeholder
     images[]    extra screenshots: { src, alt, width, height }
     accent      placeholder gradient color (keep it dark enough for
                 white text to stay readable)

   Rules: no private identifiers (bundle/app IDs, Team IDs, Firebase
   project IDs, API keys, IPs, student numbers) and no private repo URLs.
   ============================================================ */

const PROJECTS = [
    /* ---------- Featured ---------- */
    {
        slug: 'prayer-walk',
        title: 'Prayer Walk',
        client: 'CALLED Presentations',
        category: ['Mobile', 'Client work'],
        featured: true,
        status: '', // TODO(Ralph): e.g. "Live on Google Play · iOS coming soon"
        year: '', // TODO(Ralph)
        role: 'Developer',
        summary: 'A Flutter GPS devotional walking app: users go on prayer walks while the app tracks their route and delivers scripture along the way.',
        overview: 'Prayer Walk is a GPS devotional walking app built for CALLED Presentations. Users head out on a prayer walk while the app tracks their route and steps and delivers scripture along the way, read aloud with text-to-speech. The project started in React Native / Expo and was migrated to Flutter, then shipped to the Google Play Store production track under the client\'s organization account and taken through iOS App Store submission.',
        features: [
            'GPS route tracking engine (geolocator) with step counting (pedometer)',
            'Mapbox maps',
            'Supabase backend with Google Sign-In',
            'Social features',
            'Scripture delivery with text-to-speech (flutter_tts), using the public-domain World English Bible (WEBBE)',
            'Admin console',
        ],
        highlights: [
            'Started in React Native / Expo, then migrated to Flutter',
            'Shipped to the Google Play Store production track under the client\'s organization account',
            'Took it through iOS App Store submission without owning a Mac, using Codemagic CI for builds and signing plus remote Mac sessions',
            'Fixed a Google Sign-In failure in Play testing caused by an unregistered app-signing key by registering its SHA-1 as an Android OAuth client',
            'Handled secret-key hygiene after a signing key was committed: rotated the key and moved it out of the repo',
        ],
        stack: ['Flutter', 'Dart', 'Supabase', 'Google Sign-In', 'Mapbox', 'flutter_tts', 'geolocator', 'pedometer', 'Codemagic'],
        links: {
            live: '',
            repo: '',
            playStore: '', // TODO(Ralph): public Google Play listing URL
            appStore: '', // TODO(Ralph): public App Store listing URL (once live)
        },
        cover: '', // TODO(Ralph): add assets/projects/prayer-walk/cover.webp, then set this path
        images: [],
        accent: '#0F766E',
    },
    {
        slug: 'mamiya-theatre',
        title: 'Mamiya Theatre Ticketing System',
        client: 'Dr. Richard T. Mamiya Theatre, Honolulu',
        category: ['Web', 'Client work'],
        featured: true,
        status: '', // TODO(Ralph): e.g. "Live" / "In development"
        year: '', // TODO(Ralph)
        role: 'Developer',
        summary: 'A full online ticketing system: pick a showtime, choose seats on an interactive map, pay, and receive a QR e-ticket by email.',
        overview: 'An end-to-end online ticketing system for the Dr. Richard T. Mamiya Theatre in Honolulu. Guests pick a showtime, choose seats on an interactive map of the real 503-seat house, pay with Stripe or PayPal, and receive a QR e-ticket by email. Payments and email run through Supabase Edge Functions, and amounts are always recomputed on the server.',
        features: [
            'Real 503-seat layout: rows A–P (no Row I), three price zones, wheelchair spaces in Row P',
            'Multiple showtimes',
            'Mobile seat map with pinch-zoom and pan',
            'Stripe and PayPal checkout',
            'QR e-tickets embedded inline in confirmation emails (Resend)',
            'Admin dashboard with real analytics',
        ],
        highlights: [
            'Payment amounts are recomputed server-side, never trusted from the client',
            'Bookings are finalized only via payment webhook or server-side capture',
            'Supabase Edge Functions handle payments and email',
            'Deployed on Vercel with a go-live checklist for the payment and email providers',
        ],
        stack: ['React Native Web', 'webpack', 'TypeScript', 'Supabase', 'Postgres', 'Edge Functions', 'Stripe', 'PayPal', 'Resend', 'Vercel'],
        links: {
            live: '', // TODO(Ralph): public site URL
            repo: '', // TODO(Ralph): only if the repo is public
            playStore: '',
            appStore: '',
        },
        cover: '', // TODO(Ralph): add assets/projects/mamiya-theatre/cover.webp, then set this path
        images: [],
        accent: '#9F1239',
    },
    {
        slug: 'drincup',
        title: 'Drincup Cafe Ordering App',
        client: 'Drincup Cafe, Honolulu, HI',
        category: ['Web', 'Client work'],
        featured: true,
        status: '', // TODO(Ralph)
        year: '', // TODO(Ralph)
        role: 'Developer', // TODO(Ralph): confirm role
        summary: 'A Starbucks-style order-ahead web app: browse the menu, customize drinks, order ahead and pick up.',
        overview: 'A Starbucks-style order-ahead web app for Drincup Cafe, a coffee shop in Honolulu: customers browse the menu, customize their drinks, order ahead and pick up in store.',
        // TODO(Ralph): fill in features, highlights and stack — left empty on purpose.
        features: [],
        highlights: [],
        stack: [],
        links: {
            live: '', // TODO(Ralph)
            repo: '', // TODO(Ralph)
            playStore: '',
            appStore: '',
        },
        cover: '', // TODO(Ralph): add assets/projects/drincup/cover.webp, then set this path
        images: [],
        accent: '#92400E',
    },

    /* ---------- Other projects ---------- */
    {
        slug: 'novaride',
        title: 'NovaRide',
        client: 'Capstone team project, TIP-QC',
        category: ['Mobile', 'Web'],
        featured: false,
        status: 'In development',
        year: '', // TODO(Ralph)
        role: 'Admin / TNVS operator dashboard (Flutter web + Firebase)',
        summary: 'An IoT smart-helmet system for TNVS riders. I built the admin / operator dashboard.',
        overview: 'NovaRide is a capstone team project at TIP-QC: an IoT smart-helmet system for TNVS riders. My part is the admin / TNVS operator dashboard, built as a Flutter web app on Firebase (Cloud Firestore).',
        features: [],
        highlights: [],
        stack: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'IoT'],
        links: {
            live: '',
            repo: '', // TODO(Ralph): ask the team whether the repo can be linked publicly
            playStore: '',
            appStore: '',
        },
        cover: '',
        images: [],
        accent: '#1D4ED8',
    },
    {
        slug: 'hawaii-booths',
        title: 'Hawaii Booths Landing Page',
        client: 'Client work',
        category: ['Web', 'Client work'],
        featured: false,
        status: '',
        year: '', // TODO(Ralph)
        role: 'Developer',
        summary: 'A landing page for a premium photo, video and audio booth rental company serving weddings, corporate events and parties.',
        overview: 'A landing page for a premium photo, video and audio booth rental company (weddings, corporate events, parties). It includes an interactive webcam "Try it out" photobooth section and a scroll-linked photo-print animation.',
        features: [
            'Interactive webcam "Try it out" photobooth section',
            'Scroll-linked photo-print animation',
        ],
        highlights: [],
        stack: ['HTML', 'Tailwind CSS', 'JavaScript'],
        links: {
            live: '', // TODO(Ralph): live URL
            repo: 'https://github.com/RalphNatal/Hawaii_PhotoBooth',
            playStore: '',
            appStore: '',
        },
        cover: '',
        images: [],
        accent: '#0E7490',
    },
    {
        slug: 'cantu-collective',
        title: 'The Cantu Collective — Digital Invitation',
        client: 'Cantu Beauty event',
        category: ['Web', 'Client work'],
        featured: false,
        status: '',
        year: '', // TODO(Ralph)
        role: 'Developer',
        summary: 'A 3-step personalized invitation microsite with a burnt-orange and cream stationery aesthetic.',
        overview: 'A personalized digital invitation for a Cantu Beauty event, built as a 3-step microsite in a burnt-orange and cream stationery aesthetic.',
        features: [
            'Step 1: the guest enters their name',
            'Step 2: a personalized invitation with the name set in script type',
            'Step 3: assessment / RSVP via an embedded Tally form',
        ],
        highlights: [],
        stack: ['HTML', 'CSS', 'JavaScript', 'Tally'],
        links: { live: '', repo: '', playStore: '', appStore: '' }, // TODO(Ralph): live link if public
        cover: '',
        images: [],
        accent: '#C2410C',
    },
    {
        slug: 'myxie-portfolio',
        title: 'Myxie — Portfolio Website',
        client: 'Client work',
        category: ['Web', 'Client work'],
        featured: false,
        status: '',
        year: '', // TODO(Ralph)
        role: 'Developer',
        summary: 'A portfolio website built for a client.',
        overview: 'A portfolio website built for a client.', // TODO(Ralph): add details
        features: [],
        highlights: [],
        stack: [], // TODO(Ralph)
        links: {
            live: '', // TODO(Ralph)
            repo: 'https://github.com/RalphNatal/myxie-s_portfolio',
            playStore: '',
            appStore: '',
        },
        cover: '',
        images: [],
        accent: '#7E22CE',
    },
    {
        slug: 'bear-trap-ranch',
        title: 'Bear Trap Ranch Donation Page',
        client: 'Via CALLED Presentations',
        category: ['Web', 'Client work'],
        featured: false,
        status: '',
        year: '', // TODO(Ralph)
        role: 'Developer: form integration and site revision document',
        summary: 'Integrated a GoHighLevel donation form into the client\'s Webwave site and wrote the site revision document.',
        overview: 'Client work via CALLED Presentations: I integrated a GoHighLevel donation form into the client\'s Webwave site and wrote the site revision document.',
        features: [],
        highlights: [],
        stack: ['Webwave', 'GoHighLevel'],
        links: { live: '', repo: '', playStore: '', appStore: '' },
        cover: '',
        images: [],
        accent: '#3F6212',
    },
    {
        slug: 'gyrosteps',
        title: 'GyroSteps — Mobile App & Monitoring Dashboard UI',
        client: '',
        category: ['Design/UI'],
        featured: false,
        status: '',
        year: '', // TODO(Ralph)
        role: 'UI/UX designer (Figma)',
        summary: 'Figma UI/UX for a fall-detection app and a caregiver monitoring dashboard.',
        overview: 'UI/UX design in Figma for a fall-detection mobile application and a companion monitoring dashboard for caregivers and health providers. The prototype covers the user dashboard, real-time alerts and caregiver notifications, plus an admin view of fall alerts, health metrics and incident history.',
        features: [
            'User dashboard with real-time alerts',
            'Caregiver notifications',
            'Monitoring dashboard with alert and incident history',
        ],
        highlights: [],
        stack: ['Figma'],
        links: { live: '', repo: '', playStore: '', appStore: '' },
        cover: 'assets/design/gyrosteps-dashboard.webp',
        images: [
            { src: 'assets/design/gyrosteps-dashboard.webp', alt: 'GyroStep caregiver dashboard with a "Status: Safe" banner, quick actions and recent activity', width: 1470, height: 958 },
            { src: 'assets/design/gyrosteps-event-history.webp', alt: 'GyroStep event history screen with a weekly activity chart and a table of past alerts', width: 1421, height: 961 },
        ],
        accent: '#2563EB',
    },
    {
        slug: 'math-quiz-game',
        title: 'Math Quiz Game',
        client: 'Personal project',
        category: ['Game'],
        featured: false,
        status: 'In development',
        year: '', // TODO(Ralph)
        role: 'Developer',
        summary: 'A Quizizz-style 2D math quiz game built in Unity.',
        overview: 'A Quizizz-style 2D math quiz game built in Unity 6 LTS with C#, with question banks loaded from JSON.',
        features: [],
        highlights: [],
        stack: ['Unity 6 LTS', 'C#', 'uGUI', 'TextMeshPro', 'JSON', 'Unity Gaming Services'],
        links: { live: '', repo: '', playStore: '', appStore: '' },
        cover: '',
        images: [],
        accent: '#4338CA',
    },

    /* ---------- Security & coursework ---------- */
    {
        slug: 'red-blue-team-assessment',
        title: 'Red Team / Blue Team Assessment',
        client: 'IAS 2 course',
        category: ['Security'],
        featured: false,
        group: 'coursework',
        status: '',
        year: '', // TODO(Ralph)
        role: 'Red team, then blue team',
        summary: 'Assessed a PHP/MySQL web app in a controlled environment, then patched the vulnerabilities found.',
        overview: 'Coursework for IAS 2. Working in a controlled lab environment, I first assessed a PHP/MySQL web application as the red team, then switched to the blue team to patch the vulnerabilities found.',
        features: [],
        highlights: [],
        stack: ['Kali Linux', 'PHP', 'MySQL'],
        links: { live: '', repo: '', playStore: '', appStore: '' },
        cover: '',
        images: [],
        accent: '#334155',
    },
    {
        slug: 'cleartext-credentials-lab',
        title: 'Cleartext Credentials Lab',
        client: 'Ethical Hacking & Penetration Testing final',
        category: ['Security'],
        featured: false,
        group: 'coursework',
        status: '',
        year: '', // TODO(Ralph)
        role: 'Project lead',
        summary: 'An isolated lab showing why login forms must use HTTPS, with defense recommendations.',
        overview: 'An isolated VirtualBox lab that demonstrates why login forms must use HTTPS: credentials submitted over plain HTTP are visible in Wireshark packet captures. The project closes with defense recommendations.',
        features: [],
        highlights: [],
        stack: ['Kali Linux', 'Windows 10 VM', 'VirtualBox', 'Wireshark'],
        links: { live: '', repo: '', playStore: '', appStore: '' },
        cover: '',
        images: [],
        accent: '#1E3A5F',
    },
    {
        slug: 'data-privacy-case-study',
        title: 'Data Privacy Case Study',
        client: 'Group project',
        category: ['Security'],
        featured: false,
        group: 'coursework',
        status: '',
        year: '', // TODO(Ralph)
        role: '', // TODO(Ralph): your part in the group
        summary: 'An ethics and law analysis of a government portal that exposed residents\' personal data to search engines.',
        overview: 'An ethics and law case study of a government portal that exposed residents\' personal data to search engines, analyzed through the Philippine Data Privacy Act of 2012 (RA 10173) and professional responsibility.',
        features: [],
        highlights: [],
        stack: [],
        links: { live: '', repo: '', playStore: '', appStore: '' },
        cover: '',
        images: [],
        accent: '#3B3F5C',
    },
    {
        slug: 'sap-erp-quiz',
        title: 'SAP ERP Interactive Quiz App',
        client: 'Coursework',
        category: ['Web'],
        featured: false,
        group: 'coursework',
        status: '',
        year: '', // TODO(Ralph)
        role: 'Developer',
        summary: 'A small interactive HTML quiz app for reviewing an SAP ERP course.',
        overview: 'A small interactive HTML quiz app for reviewing an SAP ERP course.',
        features: [],
        highlights: [],
        stack: ['HTML'], // TODO(Ralph): add the rest of the stack if you want
        links: { live: '', repo: '', playStore: '', appStore: '' },
        cover: '',
        images: [],
        accent: '#0F5257',
    },
];
