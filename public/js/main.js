/**
 * Interactive Portfolio - Main JavaScript
 * Features: Mouse tracking, parallax, animations, custom cursor
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all interactive features
    initLoader();
    initNavbar();
    initLanguageSwitcher();
    initMouseTracking();
    initAvatarEyeTracking(); // SVG Avatar eye tracking
    initParallax();
    initRevealAnimations();
    initMagneticButtons();
    initStatsCounter();
});

/**
 * Page Loader
 */
function initLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        });
    }
}

/**
 * Navbar scroll effect
 */
function initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu background fix
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', () => {
            navbar.classList.add('mobile-menu-active');
        });

        navbarCollapse.addEventListener('hide.bs.collapse', () => {
            navbar.classList.remove('mobile-menu-active');
        });
    }

    // Mobile menu close on link click
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse) {
                const collapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (collapse) collapse.hide();
            }
        });
    });
}

/**
 * Language Switcher
 */
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.btn-lang');
    const currentLang = localStorage.getItem('lang') || 'tr';

    // Initial set (instant)
    setLanguage(currentLang);

    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        btn.addEventListener('click', function () {
            const newLang = this.dataset.lang;
            if (newLang === localStorage.getItem('lang')) return;

            // 1. Start Animation (Fade Out)
            const elements = document.querySelectorAll('[data-tr], [data-en]');
            elements.forEach(el => {
                el.classList.add('lang-anim');
                el.classList.add('fade-out');
            });

            // Update Active Button
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 2. Wait for Fade Out, Then Change Text
            setTimeout(() => {
                setLanguage(newLang);
                localStorage.setItem('lang', newLang);

                // 3. Fade In
                elements.forEach(el => {
                    el.classList.remove('fade-out');
                });

                // Cleanup transition class
                setTimeout(() => {
                    elements.forEach(el => el.classList.remove('lang-anim'));
                }, 300);

            }, 300); // Wait for CSS transition (300ms)
        });
    });
}

function setLanguage(lang) {
    document.querySelectorAll('[data-tr], [data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text && el.children.length === 0) {
            el.textContent = text;
        }
    });
    document.documentElement.lang = lang;
}

/**
 * Mouse Tracking Effects
 * - Gradient orbs follow mouse
 * - Parallax on hero elements
 */
function initMouseTracking() {
    const orbs = document.querySelectorAll('.gradient-orb');
    const profileContainer = document.querySelector('.profile-image-container');
    const floatingBadges = document.querySelectorAll('.floating-badge');

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Move gradient orbs slightly with mouse
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mouseX - window.innerWidth / 2) * speed;
            const y = (mouseY - window.innerHeight / 2) * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Tilt profile image based on mouse position
        if (profileContainer) {
            const rect = profileContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const angleX = (mouseY - centerY) * 0.01;
            const angleY = (mouseX - centerX) * -0.01;

            profileContainer.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        }

        // Move floating badges opposite to mouse
        floatingBadges.forEach((badge, index) => {
            const speed = (index + 1) * 0.03;
            const x = (mouseX - window.innerWidth / 2) * -speed;
            const y = (mouseY - window.innerHeight / 2) * -speed;
            badge.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Reset transforms when mouse leaves
    document.addEventListener('mouseleave', () => {
        orbs.forEach(orb => {
            orb.style.transform = 'translate(0, 0)';
        });
        if (profileContainer) {
            profileContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
    });
}

/**
 * Parallax scrolling effect
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * Reveal animations on scroll
 */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/**
 * Magnetic button effect
 */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Stats counter animation
 */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count) || 0;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Toast notification
 */
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1100';
        document.body.appendChild(container);
    }

    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-primary';

    const toastHtml = `
        <div id="${toastId}" class="toast ${bgClass} text-white" role="alert">
            <div class="toast-body d-flex align-items-center gap-2">
                <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-info-circle'}"></i>
                ${message}
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);

    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

/**
 * Typing effect for hero subtitle
 */
function initTypingEffect() {
    const element = document.querySelector('.typing-text');
    if (!element) return;

    const texts = element.dataset.texts?.split('|') || ['Developer', 'Designer', 'Creator'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Initialize typing effect if exists
document.addEventListener('DOMContentLoaded', initTypingEffect);

/**
 * SVG Avatar Eye Tracking with LERP Animation
 * Robb Owen style - smooth "water-like" eye movement
 * Uses requestAnimationFrame with Linear Interpolation (LERP)
 */
function initAvatarEyeTracking() {
    const avatarContainer = document.getElementById('avatarContainer');
    const pupils = document.querySelectorAll('.eye-pupil');

    if (!avatarContainer || pupils.length === 0) return;

    // Configuration
    const LERP_FACTOR = 0.1;
    // Mobilde hareket aralığını azalt (göz bebeği beyazın dışına çıkmasın)
    const isMobile = window.innerWidth <= 768;
    const MAX_MOVE = isMobile ? 1 : 2; // Mobilde daha az hareket

    // Target coordinates
    let targetX = 0;
    let targetY = 0;

    // Current coordinates for each pupil
    let currentX = 0;
    let currentY = 0;

    function handleMouseMove(e) {
        const rect = avatarContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        // Normalize (-1 to 1)
        const normalizedX = Math.max(-1, Math.min(1, dx / (window.innerWidth / 4)));
        const normalizedY = Math.max(-1, Math.min(1, dy / (window.innerHeight / 4)));

        targetX = normalizedX * MAX_MOVE;
        targetY = normalizedY * MAX_MOVE;
    }

    function render() {
        // LERP for smooth movement
        currentX += (targetX - currentX) * LERP_FACTOR;
        currentY += (targetY - currentY) * LERP_FACTOR;

        pupils.forEach(pupil => {
            pupil.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        requestAnimationFrame(render);
    }

    document.addEventListener('mousemove', handleMouseMove);
    requestAnimationFrame(render);

    console.log('Avatar LERP eye tracking initialized (Class-based)');
}

/**
 * Project Detail Modal
 * Opens a modal with project details, media gallery, and contact button
 */
let currentProject = null;
let currentMediaIndex = 0;

// Open project modal by fetching project data
async function openProjectModal(projectId) {
    try {
        // Fetch project data from API
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error('Project not found');

        const project = await response.json();
        currentProject = project;
        currentMediaIndex = 0;

        // Get language
        const isEnglish = localStorage.getItem('language') === 'en';

        // Populate modal content
        const modal = document.getElementById('projectModal');
        const titleEl = document.getElementById('projectModalTitle');
        const descEl = document.getElementById('projectModalDescription');
        const techTagsEl = document.getElementById('projectTechTags');
        const mainMediaEl = document.getElementById('projectMainMedia');
        const thumbnailsEl = document.getElementById('projectThumbnails');
        const contactBtn = document.getElementById('projectContactBtn');
        const githubBtn = document.getElementById('projectGithubBtn');
        const liveBtn = document.getElementById('projectLiveBtn');

        // Set title and description
        titleEl.textContent = isEnglish ? (project.title_en || project.title) : project.title;
        descEl.textContent = isEnglish
            ? (project.detailedDescription_en || project.description_en || project.description)
            : (project.detailedDescription || project.description);

        // Set technology tags
        techTagsEl.innerHTML = '';
        if (project.technologies && project.technologies.length > 0) {
            project.technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                techTagsEl.appendChild(tag);
            });
        }

        // Set media - use project thumbnail if no media array
        const mediaList = project.media && project.media.length > 0
            ? project.media
            : [{ type: 'image', url: project.imageUrl }];

        // Set main media
        setMainMedia(mainMediaEl, mediaList[0]);

        // Set thumbnails
        thumbnailsEl.innerHTML = '';
        if (mediaList.length > 1) {
            mediaList.forEach((media, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'project-media-thumb' + (index === 0 ? ' active' : '');
                thumb.onclick = () => selectMedia(index);

                if (media.type === 'video') {
                    const video = document.createElement('video');
                    video.src = media.url;
                    video.muted = true;
                    thumb.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = media.url;
                    img.alt = `Thumbnail ${index + 1}`;
                    thumb.appendChild(img);
                }
                thumbnailsEl.appendChild(thumb);
            });
        }

        // Set contact button href
        const projectName = encodeURIComponent(project.title);
        contactBtn.href = `/contact?project=${projectName}`;

        // Set GitHub button
        if (project.githubUrl) {
            githubBtn.href = project.githubUrl;
            githubBtn.style.display = 'inline-flex';
        } else {
            githubBtn.style.display = 'none';
        }

        // Set Live button
        if (project.liveUrl && project.liveUrl.startsWith('http')) {
            liveBtn.href = project.liveUrl;
            liveBtn.style.display = 'inline-flex';
        } else {
            liveBtn.style.display = 'none';
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error('Error loading project:', error);
    }
}

// Set main media element (image or video)
function setMainMedia(element, media) {
    const carousel = document.getElementById('projectMediaCarousel');
    carousel.innerHTML = '';

    if (media.type === 'video') {
        const video = document.createElement('video');
        video.className = 'project-media-main video';
        video.src = media.url;
        video.controls = true;
        video.autoplay = false;
        carousel.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.className = 'project-media-main';
        img.src = media.url;
        img.alt = currentProject?.title || 'Project Image';
        carousel.appendChild(img);
    }
}

// Select media from thumbnails
function selectMedia(index) {
    const mediaList = currentProject.media && currentProject.media.length > 0
        ? currentProject.media
        : [{ type: 'image', url: currentProject.imageUrl }];

    if (index < 0 || index >= mediaList.length) return;

    currentMediaIndex = index;
    setMainMedia(null, mediaList[index]);

    // Update thumbnail active state
    document.querySelectorAll('.project-media-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Stop any playing videos
        const videos = modal.querySelectorAll('video');
        videos.forEach(v => v.pause());
    }
    currentProject = null;
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

/**
 * Download CV based on current language
 */
function downloadCV() {
    const lang = localStorage.getItem('lang') || 'tr';
    const filename = lang === 'en' ? 'Kadir_Gedik_CV_(ENG).pdf' : 'Kadir_Gedik_CV_(TR).pdf';
    // URL encode the filename to handle special characters like parentheses
    const encodedFilename = encodeURIComponent(filename);
    const filePath = '/media/' + encodedFilename;

    // Open in new tab - more reliable for PDF downloads
    window.open(filePath, '_blank');
}
