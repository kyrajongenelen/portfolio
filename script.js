/**
 * PORTFOLIO WEBSITE JAVASCRIPT - KYRA JONGENELEN
 * Functies:
 *  - ScrollSpy & Vloeiende navigatie (Bovenkant / Intro, Portfolio, Over Mij, Contact)
 *  - Logo & Terug-navigatie naar de echte bovenkant van de pagina
 *  - Real-time live search filter voor projecten
 *  - Lightbox modal voor horizontaal scrollbare fotogalerijen
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollSpyAndNav();
    initLogoAndBackNavigation();
    initProjectSearch();
    initGalleryAndLightbox();
});

/* ==========================================================
   1. SCROLLSPY & VLOEIENDE NAVIGATIE
   ========================================================== */
function initScrollSpyAndNav() {
    const navLinks = document.querySelectorAll('.nav-link[data-nav]');
    const sections = document.querySelectorAll('.content-section');

    if (!navLinks.length || !sections.length) return;

    // Vloeiend scrollen bij klik op een navigatielink
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-nav');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Actieve klasse direct toekennen
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Update URL hash
                if (history.replaceState) {
                    history.replaceState(null, null, `#${targetId}`);
                }
            }
        });
    });

    // ScrollSpy: markeer de actieve link afhankelijk van scrollpositie
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    if (link.getAttribute('data-nav') === sectionId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ==========================================================
   2. LOGO & TERUG-NAVIGATIE NAAR DE ECHTE BOVENKANT
   ========================================================== */
function initLogoAndBackNavigation() {
    const logoLinks = document.querySelectorAll('.logo-link');

    logoLinks.forEach(logo => {
        logo.addEventListener('click', (e) => {
            // Als we al op de hoofdpagina zijn, scroll altijd soepel naar de allerbovenste rand
            const isHomePage = window.location.pathname.endsWith('index.html') || 
                               window.location.pathname.endsWith('/') || 
                               window.location.pathname === '' || 
                               !window.location.pathname.includes('project-');

            if (isHomePage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Reset hash in URL zodat we bovenaan zijn
                if (history.replaceState) {
                    history.replaceState(null, null, window.location.pathname);
                }
            }
        });
    });

    // Controleer bij het laden van index.html of er géén specifieke hashtag staat
    const hash = window.location.hash.replace('#', '');
    if (!hash || hash === 'intro') {
        window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
}

/* ==========================================================
   3. LIVE SEARCH FILTER VOOR PROJECTEN
   ========================================================== */
function initProjectSearch() {
    const searchInput = document.getElementById('searchInput');
    const projectCards = document.querySelectorAll('.project-card');
    const noResults = document.getElementById('noResults');
    const queryText = document.getElementById('queryText');
    const portfolioSection = document.getElementById('portfolio');

    if (!searchInput || !projectCards.length) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        // Als de gebruiker begint met typen, scroll soepel naar de portfolio sectie
        if (query.length > 0 && portfolioSection) {
            const rect = portfolioSection.getBoundingClientRect();
            if (rect.top < -100 || rect.top > 300) {
                portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        let visibleCount = 0;

        projectCards.forEach(card => {
            const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
            const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
            const tag = (card.querySelector('.card-tag')?.textContent || '').toLowerCase();

            const isMatch = keywords.includes(query) || title.includes(query) || tag.includes(query);

            if (isMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResults) {
            if (visibleCount === 0) {
                noResults.style.display = 'block';
                if (queryText) queryText.textContent = query;
            } else {
                noResults.style.display = 'none';
            }
        }
    });

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
}

/* ==========================================================
   4. DETAILPAGINA HORIZONTALE GALERIJ & LIGHTBOX MODAL
   ========================================================== */
function initGalleryAndLightbox() {
    const galleryImgs = document.querySelectorAll('.gallery-item-img, .detail-main-image');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (galleryImgs.length && lightboxModal && lightboxImg) {
        galleryImgs.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Vergrote afbeelding';
                lightboxModal.classList.add('active');
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightboxModal.classList.remove('active');
            });
        }

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                lightboxModal.classList.remove('active');
            }
        });
    }
}
