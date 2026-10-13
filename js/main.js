/* ============================================================
   RALPH NATAL — PORTFOLIO SCRIPTS
   Plain JavaScript, no frameworks. Project data lives in js/projects.js.
   ============================================================ */

/* ---------- Settings ---------- */

// Set to false to hide the phone number from the Contact section.
const SHOW_PHONE = true;
const PHONE = { display: '+63 915 165 0391', href: 'tel:+639151650391' };

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Filter chip -> project category. "All" shows everything.
const CATEGORY_ORDER = ['Mobile', 'Web', 'Client work', 'Design/UI', 'Game', 'Security'];

// Sprite icon (see <svg class="sprite"> in index.html) per primary category, used on placeholder covers
const CATEGORY_ICONS = {
    'Mobile': 'mobile',
    'Web': 'globe',
    'Client work': 'briefcase',
    'Design/UI': 'pen',
    'Game': 'gamepad',
    'Security': 'shield',
};

/* ============================================================
   HELPERS
   ============================================================ */

/** Escape text before putting it into innerHTML. */
function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
}

/** Allow only http(s) links from the data file. */
function safeUrl(url) {
    return /^https?:\/\//i.test(url || '') ? url : '';
}

/** Inline icon from the SVG sprite in index.html. */
function icon(name) {
    return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

const ARROW_SVG = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/**
 * Open a <dialog> as a modal with focus management:
 * focus is kept inside while open and returned to the opener on close.
 */
function openDialog(dialog, opener) {
    if (dialog.open) return;
    dialog._opener = opener || document.activeElement;
    dialog.showModal();
    document.documentElement.classList.add('modal-open');
}

function initDialogs() {
    document.querySelectorAll('dialog').forEach(dialog => {
        // Close buttons
        dialog.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => dialog.close());
        });

        // Click on the backdrop (outside the panel) closes it
        dialog.addEventListener('click', e => {
            if (e.target === dialog) dialog.close();
        });

        // Keep Tab / Shift+Tab inside the dialog
        dialog.addEventListener('keydown', e => {
            if (e.key !== 'Tab') return;
            const focusables = [...dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
                .filter(el => el.offsetParent !== null);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });

        // Escape fires "cancel" then "close" natively; restore focus on close
        dialog.addEventListener('close', () => {
            if (!document.querySelector('dialog[open]')) {
                document.documentElement.classList.remove('modal-open');
            }
            const opener = dialog._opener;
            if (opener && typeof opener.focus === 'function' && document.contains(opener)) {
                opener.focus({ preventScroll: true });
            }
        });
    });
}

/* ============================================================
   THEME (light / dark)
   The inline script in <head> sets data-theme before first paint.
   ============================================================ */
function initTheme() {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    const themeColor = { light: '#F6F8FC', dark: '#0B1120' };

    function getStored() {
        try { return localStorage.getItem('theme'); } catch (e) { return null; }
    }

    function apply(theme) {
        root.setAttribute('data-theme', theme);
        document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', themeColor[theme]));
        if (toggle) toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

    // The old version stored "darkMode"; it's no longer used.
    try { localStorage.removeItem('darkMode'); } catch (e) { /* ignore */ }

    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            apply(next);
            try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
        });
    }

    // Follow OS changes until the visitor picks a theme themselves
    systemDark.addEventListener('change', e => {
        if (!getStored()) apply(e.matches ? 'dark' : 'light');
    });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!header || !toggle || !menu) return;

    function setOpen(open, { returnFocus = false } = {}) {
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (!open && returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

    // Close on link click
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false, { returnFocus: true });
    });

    // Close when clicking outside the header
    document.addEventListener('click', e => {
        if (menu.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });

    // Reset when resizing up to the desktop layout
    window.matchMedia('(min-width: 960px)').addEventListener('change', e => {
        if (e.matches) setOpen(false);
    });

    // Header border/shadow once the page has scrolled
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    // (A restored scroll position fires a scroll event too, so no initial check is needed.)
    window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Highlight the nav link of the section currently in view.
 */
function initActiveNavLink() {
    const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(link => {
                const active = link.getAttribute('href') === `#${entry.target.id}`;
                link.classList.toggle('is-active', active);
                if (active) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}

/* ============================================================
   SCROLL REVEAL (skipped under prefers-reduced-motion)
   ============================================================ */
function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(item => observer.observe(item));
}

/* ============================================================
   HERO TYPING ANIMATION
   Screen readers get the full text from a .sr-only span; the typed
   span is aria-hidden. Under reduced motion the text simply stays put.
   ============================================================ */
function initTyping() {
    const el = document.getElementById('typedSubtitle');
    if (!el || prefersReducedMotion) return;

    const text = el.textContent.trim();
    let i = 0;
    el.classList.add('is-typing');

    (function type() {
        el.textContent = text.slice(0, i);
        if (i++ < text.length) {
            setTimeout(type, 40);
        } else {
            el.classList.add('typed-done');
            setTimeout(() => el.classList.remove('is-typing'), 1600);
        }
    })();
}

/* ============================================================
   CONTACT (optional phone number)
   ============================================================ */
function initContact() {
    const list = document.getElementById('contactList');
    if (!SHOW_PHONE || !list) return;

    const item = document.createElement('li');
    item.innerHTML = `
        <span class="contact-icon" aria-hidden="true">${icon('phone')}</span>
        <div><span class="contact-label">Phone</span><a href="${esc(PHONE.href)}">${esc(PHONE.display)}</a></div>`;
    // Insert right after the email item
    list.insertBefore(item, list.children[1] || null);
}

/* ============================================================
   PROJECTS — cards, filters and detail modal
   ============================================================ */
function primaryCategory(project) {
    return (project.category && project.category[0]) || 'Web';
}

function statusClass(status) {
    if (/live|launched|published|deployed/i.test(status)) return 'badge--live';
    if (/develop|progress|beta|testing|coming/i.test(status)) return 'badge--dev';
    return '';
}

function statusBadge(status) {
    return status ? `<span class="badge ${statusClass(status)}">${esc(status)}</span>` : '';
}

/** Generated cover: accent gradient + category icon + project name. */
function placeholderCover(project) {
    const cat = primaryCategory(project);
    const iconName = CATEGORY_ICONS[cat] || 'code';
    return `
        <div class="cover-placeholder" style="--project-accent:${esc(project.accent || '#1D4ED8')}" aria-hidden="true">
            <span class="ph-icon">${icon(iconName)}</span>
            <span>
                <span class="ph-category">${esc(cat)}</span><br>
                <span class="ph-title">${esc(project.title)}</span>
            </span>
        </div>`;
}

/**
 * Cover markup: real image if `cover` is set, otherwise the placeholder.
 * If the image fails to load, it swaps itself for the placeholder.
 */
function coverMarkup(project, { eager = false } = {}) {
    if (!project.cover) return placeholderCover(project);
    return `
        <img src="${esc(project.cover)}" alt="" width="1600" height="1000"
             loading="${eager ? 'eager' : 'lazy'}" decoding="async" data-fallback="${esc(project.slug)}">`;
}

function chipList(items, max) {
    if (!items || !items.length) return '';
    const shown = max ? items.slice(0, max) : items;
    const extra = max && items.length > max ? `<li>+${items.length - max}</li>` : '';
    return `<ul class="chips">${shown.map(s => `<li>${esc(s)}</li>`).join('')}${extra}</ul>`;
}

function cardMarkup(project) {
    const featured = !!project.featured;
    const client = project.client ? `<p class="project-client">${esc(project.client)}</p>` : '';
    return `
        <article class="project-card${featured ? ' project-card--featured' : ''}" data-slug="${esc(project.slug)}">
            <div class="project-cover">${coverMarkup(project)}</div>
            <div class="project-body">
                <div class="project-meta-top">
                    ${statusBadge(project.status)}
                    <span class="badge badge--cat">${esc(project.category.join(' · '))}</span>
                </div>
                <h4 class="project-title">
                    <button type="button" class="card-link" data-open-project="${esc(project.slug)}" aria-haspopup="dialog">${esc(project.title)}</button>
                </h4>
                ${client}
                <p class="project-summary">${esc(project.summary)}</p>
                <div class="project-stack">${chipList(project.stack, featured ? 8 : 4)}</div>
                <span class="card-more" aria-hidden="true">View details ${ARROW_SVG}</span>
            </div>
        </article>`;
}

/** Swap broken cover images for the generated placeholder. */
function attachCoverFallbacks(scope) {
    scope.querySelectorAll('img[data-fallback]').forEach(img => {
        img.addEventListener('error', () => {
            const project = PROJECTS.find(p => p.slug === img.dataset.fallback);
            if (project) img.outerHTML = placeholderCover(project);
        }, { once: true });
    });
}

function linkButtons(links) {
    const defs = [
        ['live', 'external', 'Live site'],
        ['playStore', 'play', 'Google Play'],
        ['appStore', 'mobile', 'App Store'],
        ['repo', 'github', 'Source code'],
    ];
    const items = defs
        .filter(([key]) => safeUrl(links && links[key]))
        .map(([key, iconName, label]) => `
            <a href="${esc(links[key])}" target="_blank" rel="noopener noreferrer">
                ${icon(iconName)} ${label}<span class="sr-only"> (opens in a new tab)</span>
            </a>`);
    return items.length
        ? `<div class="modal-links">${items.join('')}</div>`
        : '<p class="modal-empty">Links coming soon.</p>';
}

function listBlock(title, items) {
    if (!items || !items.length) return '';
    return `<div><h3>${esc(title)}</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
}

function modalMarkup(project) {
    const sub = [project.client, project.year].filter(Boolean).map(esc).join(' · ');
    const shots = (project.images || []).map(img => `
        <img src="${esc(img.src)}" alt="${esc(img.alt || '')}" width="${Number(img.width) || 1600}" height="${Number(img.height) || 1000}" loading="lazy" decoding="async">`).join('');

    return `
        <div class="modal-cover">${coverMarkup(project, { eager: true })}</div>
        <div class="modal-content">
            <div class="project-meta-top">
                ${statusBadge(project.status)}
                <span class="badge badge--cat">${esc(project.category.join(' · '))}</span>
            </div>
            <h2 id="projectModalTitle">${esc(project.title)}</h2>
            ${sub ? `<p class="modal-sub">${sub}</p>` : ''}

            <div class="modal-grid">
                <div class="modal-main">
                    <div><h3>Overview</h3><p>${esc(project.overview || project.summary)}</p></div>
                    ${listBlock('Key features', project.features)}
                    ${listBlock('Technical highlights', project.highlights)}
                    ${shots ? `<div><h3>Screenshots</h3><div class="modal-shots">${shots}</div></div>` : ''}
                </div>
                <aside class="modal-aside">
                    ${project.role ? `<div><h3>My role</h3><p>${esc(project.role)}</p></div>` : ''}
                    ${project.status ? `<div><h3>Status</h3><p>${esc(project.status)}</p></div>` : ''}
                    ${project.stack && project.stack.length ? `<div><h3>Stack</h3>${chipList(project.stack)}</div>` : ''}
                    <div><h3>Links</h3>${linkButtons(project.links)}</div>
                </aside>
            </div>
        </div>`;
}

function initProjects() {
    if (typeof PROJECTS === 'undefined') return;

    const containers = {
        featured: document.getElementById('projectsFeatured'),
        other: document.getElementById('projectsOther'),
        coursework: document.getElementById('projectsCoursework'),
    };
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('projectModalBody');
    const status = document.getElementById('projectsStatus');
    const filterButtons = document.querySelectorAll('.filter-chip');
    if (!containers.featured || !modal || !modalBody) return;

    // Featured keep the order from the data file; the rest sort by primary category
    const rank = p => {
        const i = CATEGORY_ORDER.indexOf(primaryCategory(p));
        return i === -1 ? CATEGORY_ORDER.length : i;
    };
    const groupOf = p => (p.featured ? 'featured' : p.group === 'coursework' ? 'coursework' : 'other');

    // Render cards (Array.prototype.sort is stable, so ties keep data-file order)
    Object.keys(containers).forEach(group => {
        let items = PROJECTS.filter(p => groupOf(p) === group);
        if (group !== 'featured') items = items.slice().sort((a, b) => rank(a) - rank(b));
        containers[group].innerHTML = items.map(cardMarkup).join('');
    });
    attachCoverFallbacks(document.getElementById('projects'));

    // ----- Filtering -----
    function applyFilter(filter) {
        let visible = 0;
        document.querySelectorAll('.project-card').forEach(card => {
            const project = PROJECTS.find(p => p.slug === card.dataset.slug);
            const show = filter === 'All' || project.category.includes(filter);
            card.hidden = !show;
            if (show) visible++;
        });
        document.querySelectorAll('.project-group').forEach(group => {
            group.hidden = !group.querySelector('.project-card:not([hidden])');
        });
        filterButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter)));
        if (status) status.textContent = `Showing ${visible} project${visible === 1 ? '' : 's'}${filter === 'All' ? '' : ` in ${filter}`}.`;
    }

    filterButtons.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

    // ----- Detail modal (deep-linkable as #project/<slug>) -----
    function openProject(slug, opener) {
        const project = PROJECTS.find(p => p.slug === slug);
        if (!project) return;
        modalBody.innerHTML = modalMarkup(project);
        attachCoverFallbacks(modalBody);
        modal.scrollTop = 0;
        openDialog(modal, opener);
        if (location.hash !== `#project/${slug}`) history.replaceState(null, '', `#project/${slug}`);
    }

    modal.addEventListener('close', () => {
        if (location.hash.startsWith('#project/')) {
            history.replaceState(null, '', location.pathname + location.search);
        }
    });

    document.getElementById('projects').addEventListener('click', e => {
        const card = e.target.closest('.project-card');
        if (!card) return;
        openProject(card.dataset.slug, card.querySelector('.card-link'));
    });

    function openFromHash() {
        const match = location.hash.match(/^#project\/([a-z0-9-]+)$/);
        if (!match) return;
        const opener = document.querySelector(`.card-link[data-open-project="${match[1]}"]`);
        if (opener) opener.closest('.project-card').scrollIntoView({ block: 'center' });
        openProject(match[1], opener);
    }
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
}

/* ============================================================
   DESIGN GALLERY + LIGHTBOX
   ============================================================ */
function initGallery() {
    const mainImage = document.getElementById('galleryMainImage');
    const title = document.getElementById('galleryMainTitle');
    const description = document.getElementById('galleryMainDescription');
    const openBtn = document.getElementById('galleryOpen');
    const thumbList = document.getElementById('galleryThumbs');
    const thumbs = [...document.querySelectorAll('#galleryThumbs .thumb')];
    if (!mainImage || !thumbs.length) return;

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    let current = 0;

    function itemAt(index) {
        const thumb = thumbs[index];
        return {
            thumb,
            src: thumb.dataset.full,
            width: thumb.dataset.width,
            height: thumb.dataset.height,
            alt: thumb.querySelector('img').alt,
            title: thumb.dataset.title || '',
            description: thumb.dataset.description || '',
        };
    }

    function show(index, { focusThumb = false, scroll = true } = {}) {
        current = (index + thumbs.length) % thumbs.length;
        const item = itemAt(current);

        if (mainImage.getAttribute('src') !== item.src) {
            mainImage.classList.add('is-loading');
            mainImage.onload = () => mainImage.classList.remove('is-loading');
            mainImage.width = item.width;
            mainImage.height = item.height;
            mainImage.src = item.src;
        }
        mainImage.alt = item.alt;
        title.textContent = item.title;
        description.textContent = item.description;
        description.hidden = !item.description;

        thumbs.forEach((t, i) => t.setAttribute('aria-pressed', String(i === current)));
        if (scroll) scrollThumbIntoView(item.thumb);
        if (focusThumb) item.thumb.focus({ preventScroll: true });

        if (lightbox && lightbox.open) fillLightbox();
    }

    /** Scroll only the thumbnail strip (never the page) so the active thumb is visible. */
    function scrollThumbIntoView(thumb) {
        const left = thumb.getBoundingClientRect().left - thumbList.getBoundingClientRect().left + thumbList.scrollLeft;
        const right = left + thumb.offsetWidth;
        let target = null;
        if (left < thumbList.scrollLeft) target = left - 8;
        else if (right > thumbList.scrollLeft + thumbList.clientWidth) target = right - thumbList.clientWidth + 8;
        if (target !== null) thumbList.scrollTo({ left: target, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    function fillLightbox() {
        const item = itemAt(current);
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt;
        lightboxImage.width = item.width;
        lightboxImage.height = item.height;
        lightboxCaption.textContent = item.title;
    }

    // Thumbnails: click to select, arrow keys to move between them
    thumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => show(i));
        thumb.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1, { focusThumb: true }); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1, { focusThumb: true }); }
        });
    });

    document.getElementById('galleryPrev')?.addEventListener('click', () => show(current - 1));
    document.getElementById('galleryNext')?.addEventListener('click', () => show(current + 1));

    // Scroll buttons for the thumbnail strip
    const scrollBy = dx => thumbList.scrollBy({ left: dx, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    document.getElementById('thumbsLeft')?.addEventListener('click', () => scrollBy(-thumbList.clientWidth * 0.8));
    document.getElementById('thumbsRight')?.addEventListener('click', () => scrollBy(thumbList.clientWidth * 0.8));

    // Lightbox
    if (lightbox && openBtn) {
        openBtn.addEventListener('click', () => {
            fillLightbox();
            openDialog(lightbox, openBtn);
        });
        document.getElementById('lightboxPrev')?.addEventListener('click', () => show(current - 1));
        document.getElementById('lightboxNext')?.addEventListener('click', () => show(current + 1));
        lightbox.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') show(current + 1);
            if (e.key === 'ArrowLeft') show(current - 1);
        });
    }

    show(0, { scroll: false });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Above-the-fold essentials first
    initTheme();
    initNav();
    initDialogs();
    initContact();

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // Everything below the fold waits until the first frame has painted,
    // and each step runs as its own task so the page stays responsive.
    const later = [initProjects, initGallery, initScrollReveal, initActiveNavLink];
    const runNext = () => {
        const task = later.shift();
        if (!task) return;
        task();
        setTimeout(runNext, 0);
    };
    requestAnimationFrame(() => setTimeout(runNext, 0));
});

// Typing starts once the page has loaded, so it never delays first paint
window.addEventListener('load', initTyping);
