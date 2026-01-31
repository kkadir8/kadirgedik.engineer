/**
 * Projects JavaScript - Load and display projects
 */

// Local Data (Bypassing API for immediate updates without server restart)
const projectsData = [
    {
        id: 'loomon-studio',
        title: 'Loomon Studio',
        title_en: 'Loomon Studio',
        shortDescription: 'Yaratıcı stüdyo web sitesi tasarımı.',
        shortDescription_en: 'Creative studio website design.',
        description: 'Loomon Studio için modern, dinamik ve etkileşimli bir web sitesi. Webflow ve özel JavaScript (GSAP/Three.js) kullanılarak geliştirildi.',
        description_en: 'A modern, dynamic, and interactive website for Loomon Studio. Developed using Webflow and custom JavaScript (GSAP/Three.js).',
        imageUrl: '/media/loomon.studio_site.png',
        tags: ['Web Development', 'Design', 'AI'],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Animation', 'Webflow'],
        githubUrl: null,
        liveUrl: 'https://loomon.studio',
        category: 'web-development'
    },
    {
        id: 'protocube-3d',
        title: 'Protocube 3D',
        title_en: 'Protocube 3D',
        shortDescription: '3D yazıcı hizmetleri için e-ticaret platformu.',
        shortDescription_en: 'E-commerce platform for 3D printing services.',
        description: 'Kullanıcıların 3D modellerini yükleyip fiyat teklifi alabildiği ve baskı hizmeti satın alabildiği web platformu. Responsive tasarım ve kullanıcı dostu arayüz.',
        description_en: 'A web platform where users can upload 3D models, get quotes, and purchase printing services. Responsive design and user-friendly interface.',
        imageUrl: '/media/protocube_site.png',
        tags: ['Web Development', 'E-commerce'],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
        githubUrl: null,
        liveUrl: 'https://protocube3d.com',
        category: 'web-development'
    },
    {
        id: 'kerim-gedik',
        title: 'Kerim Gedik Portfolio',
        title_en: 'Kerim Gedik Portfolio',
        shortDescription: 'Kişisel portfolio sitesi tasarımı ve geliştirmesi.',
        shortDescription_en: 'Personal portfolio website design and development.',
        description: 'Mimar Kerim Gedik için minimalist ve modern portfolio sitesi. Projelerin sergilendiği galeri ve iletişim bölümleri içerir.',
        description_en: 'Minimalist and modern portfolio site for Architect Kerim Gedik. Includes project gallery and contact sections.',
        imageUrl: '/media/kerimgedik.tech_site.png',
        tags: ['Web Development'],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        githubUrl: null,
        liveUrl: 'https://kerimgedik.tech',
        category: 'web-development'
    },
    {
        id: 'deeppark',
        title: 'DeepPark',
        title_en: 'DeepPark',
        shortDescription: 'Derin öğrenme ile otopark yeri tespiti. ResNet18 ve MobileNet modelleri kullanılmıştır.',
        shortDescription_en: 'Parking spot detection with deep learning. ResNet18 and MobileNet models used.',
        description: 'Otopark doluluk oranını gerçek zamanlı tespit eden derin öğrenme projesi. ResNet18 ve MobileNet mimarileri karşılaştırmalı olarak kullanıldı.',
        description_en: 'Deep learning project detecting real-time parking occupancy. ResNet18 and MobileNet architectures were used comparatively.',
        imageUrl: '/media/deeppark_logo.jpg',
        tags: ['AI / ML'],
        technologies: ['Python', 'PyTorch', 'ResNet18', 'MobileNet'],
        githubUrl: 'https://github.com/kkadir8/DeepPark',
        liveUrl: null,
        category: 'ai-ml'
    },
    {
        id: 'emotional-city',
        title: 'Emotional City',
        title_en: 'Emotional City',
        shortDescription: 'Şehirlerin duygusal haritasını çıkaran veri analizi projesi.',
        shortDescription_en: 'Data analysis project mapping the emotional state of cities.',
        description: 'Sosyal medya verilerini kullanarak şehirlerin duygusal durumunu analiz eden ve haritalandıran proje. NLP teknikleri kullanıldı.',
        description_en: 'Project analyzing and mapping the emotional state of cities using social media data. NLP techniques were used.',
        imageUrl: '/media/emotionalcity_logo.jpg',
        tags: ['AI / ML', 'Data Science'],
        technologies: ['Python', 'Flask', 'JavaScript', 'Leaflet.js'],
        githubUrl: 'https://github.com/kkadir8/Emotional-City',
        liveUrl: null,
        category: 'ai-ml'
    },
    {
        id: 'mental-health',
        title: 'Mental Health Analysis',
        title_en: 'Mental Health Analysis',
        shortDescription: 'Yapay zeka ile ruh sağlığı analizi ve destek asistanı.',
        shortDescription_en: 'Mental health analysis and support assistant with AI.',
        description: 'Kullanıcıların metin girdilerini analiz ederek ruh hali tespiti yapan ve öneriler sunan yapay zeka destekli web uygulaması.',
        description_en: 'AI-powered web app detecting mood from user text inputs and providing suggestions.',
        imageUrl: '/media/mentalhealth_logo.png',
        tags: ['AI / ML', 'Web App'],
        technologies: ['Python', 'TensorFlow', 'Flask', 'NLP'],
        githubUrl: 'https://github.com/kkadir8/Mental-Health',
        liveUrl: null,
        category: 'ai-ml'
    }
];

// Current language
let activeLanguage = null;
const getLang = () => activeLanguage || localStorage.getItem('lang') || 'tr';

/**
 * Load featured projects on homepage
 */
async function loadFeaturedProjects() {
    const container = document.getElementById('featuredProjects');
    if (!container) return;

    try {
        // Fetch from API (MongoDB)
        const response = await fetch('/api/projects/featured');
        const projects = await response.json();

        if (projects.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted">Henüz proje eklenmedi.</div>';
            return;
        }

        // Map MongoDB _id to id for compatibility
        const mappedProjects = projects.map(p => ({ ...p, id: p._id || p.id }));
        container.innerHTML = mappedProjects.map((project, index) => createProjectCard(project, index)).join('');

    } catch (error) {
        console.error('Error loading featured projects:', error);
        container.innerHTML = '<div class="col-12 text-center text-danger">Projeler yüklenirken hata oluştu.</div>';
    }
}

/**
 * Load all projects on projects page
 */
async function loadAllProjects() {
    const container = document.getElementById('allProjects');
    if (!container) return;

    try {
        // Fetch from API (MongoDB)
        const response = await fetch('/api/projects');
        const projects = await response.json();

        if (projects.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted">Henüz proje eklenmedi.</div>';
            return;
        }

        // Map MongoDB _id to id for compatibility
        const mappedProjects = projects.map(p => ({ ...p, id: p._id || p.id }));

        // Store projects for filtering
        window.allProjects = mappedProjects;

        renderProjects(mappedProjects);

    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = '<div class="col-12 text-center text-danger">Projeler yüklenirken hata oluştu.</div>';
    }
}

/**
 * Render projects to container
 */
function renderProjects(projects) {
    const container = document.getElementById('allProjects') || document.getElementById('featuredProjects');
    if (!container) return;

    container.innerHTML = projects.map((project, index) => createProjectCard(project, index)).join('');
}

/**
 * Create project card HTML
 */
function createProjectCard(project, index) {
    const lang = getLang();
    const title = lang === 'en' && project.title_en ? project.title_en : project.title;
    const description = lang === 'en' && project.description_en ? project.description_en : project.description;
    const shortDesc = lang === 'en' && project.shortDescription_en ? project.shortDescription_en : project.shortDescription;

    const categoryLabels = {
        'web-development': 'Web Development',
        'mobile': 'Mobile',
        'ai-ml': 'AI / ML',
        'robotics': 'Robotics',
        'other': 'Other'
    };

    const imageUrl = project.imageUrl;
    const hasValidImage = imageUrl && imageUrl !== '';

    // Show icon placeholder if no valid image
    const imageContent = hasValidImage
        ? `<img src="${imageUrl}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;">`
        : `<div class="project-placeholder"><i class="bi bi-code-slash"></i></div>`;

    return `
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="project-card" onclick="openProjectModal('${project.id}')" style="cursor: pointer;">
                <div class="project-image">
                    ${imageContent}
                    <div class="project-overlay">
                        <div class="project-links">
                            <span class="view-details-hint">
                                <i class="bi bi-eye"></i>
                                <span data-tr="Detayları Gör" data-en="View Details">Detayları Gör</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <span class="project-category">${categoryLabels[project.category] || project.category}</span>
                    <h3 class="project-title">${title}</h3>
                    <p class="project-description small mb-2">${shortDesc || description}</p>
                    <div class="project-tech">
                        ${project.technologies ? project.technologies.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Filter projects by category
 */
function filterProjects(category) {
    if (!window.allProjects) return;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // Filter and render
    const filtered = category === 'all'
        ? window.allProjects
        : window.allProjects.filter(p => p.category === category);

    renderProjects(filtered);
}

// Global function for modal to access project details
// The main.js already fetches from API for modal details... 
// Wait, if main.js fetches from API, modal details will ALSO be stale.
// I should override openProjectModal logic?
// main.js handles openProjectModal.
// I can fix main.js OR I can make the API fetch in main.js look at valid data? No, API is stale.
// I must override openProjectModal in main.js or here?
// Usually main.js functions are global.
// I can overwrite the global function here if I load this script after main.js, which index.html does (line 472).
// So I will add openProjectModal here to override main.js version.

async function openProjectModal(projectId) {
    try {
        // Fetch from API (MongoDB) - first try by ID
        let project = null;

        // Try window.allProjects first (cached from page load), then fetch
        if (window.allProjects) {
            project = window.allProjects.find(p => p.id === projectId || p._id === projectId);
        }

        if (!project) {
            // Fetch single project from API
            const response = await fetch(`/api/projects/${projectId}`);
            if (response.ok) {
                project = await response.json();
                project.id = project._id || project.id;
            }
        }

        if (!project) throw new Error('Project not found');

        // Main.js logic replication
        currentProject = project; // Assuming currentProject is global, but it's defined with 'let' in main.js. It might not be accessible.
        // If currentProject is not accessible, specific modal logic might fail (like media selection).
        // However, I can just populate the DOM elements directly here.

        // ... (Replicating modal population logic)
        // Actually, main.js defines 'let currentProject' at top level. Unless it's attached to window, I can't access it.
        // Checking main.js: "let currentProject = null;" at top level. It's module-scoped if module, otherwise global if plain script.
        // It's likely global.

        // For safety, I'll assume I can just do the DOM manipulation here.

        // Data prep
        const isEnglish = getLang() === 'en';

        const modal = document.getElementById('projectModal');
        const titleEl = document.getElementById('projectModalTitle');
        const descEl = document.getElementById('projectModalDescription');
        const techTagsEl = document.getElementById('projectTechTags');
        const mainMediaEl = document.getElementById('projectMainMedia');
        const thumbnailsEl = document.getElementById('projectThumbnails');
        const contactBtn = document.getElementById('projectContactBtn');
        const githubBtn = document.getElementById('projectGithubBtn');
        const liveBtn = document.getElementById('projectLiveBtn');

        titleEl.textContent = isEnglish ? (project.title_en || project.title) : project.title;
        descEl.textContent = isEnglish
            ? (project.description_en || project.description)
            : (project.description);

        techTagsEl.innerHTML = '';
        if (project.technologies && project.technologies.length > 0) {
            project.technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                techTagsEl.appendChild(tag);
            });
        }

        // Media handling - use images array or fallback to imageUrl
        const imagesList = project.images && project.images.length > 0
            ? project.images
            : [project.imageUrl].filter(Boolean);

        // Store current gallery state
        window.currentGalleryImages = imagesList;
        window.currentGalleryIndex = 0;

        // Render gallery with navigation
        renderGalleryImage(mainMediaEl, imagesList, 0);

        // Check if mainMediaEl is still valid or re-select carousel
        const carouselEl = document.getElementById('projectMediaCarousel');

        // Create/update navigation buttons
        let galleryNav = document.querySelector('.gallery-nav');
        if (!galleryNav && imagesList.length > 1 && carouselEl) {
            galleryNav = document.createElement('div');
            galleryNav.className = 'gallery-nav';
            galleryNav.innerHTML = `
                <button class="gallery-btn gallery-prev" onclick="changeGalleryImage(-1)">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <span class="gallery-counter">${1}/${imagesList.length}</span>
                <button class="gallery-btn gallery-next" onclick="changeGalleryImage(1)">
                    <i class="bi bi-chevron-right"></i>
                </button>
            `;
            // Insert after carousel
            if (carouselEl.parentNode) {
                carouselEl.parentNode.insertBefore(galleryNav, carouselEl.nextSibling);
            }
        } else if (galleryNav) {
            if (imagesList.length > 1) {
                galleryNav.style.display = 'flex';
                const counter = galleryNav.querySelector('.gallery-counter');
                if (counter) counter.textContent = `1/${imagesList.length}`;
            } else {
                galleryNav.style.display = 'none';
            }
        }

        // Clear old thumbnails
        thumbnailsEl.innerHTML = '';

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

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

    } catch (e) {
        console.error(e);
    }
}

// Gallery helper functions
function renderGalleryImage(container, images, index) {
    const carousel = document.getElementById('projectMediaCarousel');
    if (!carousel) return;

    const imageUrl = images[index] || '';
    carousel.innerHTML = `
        <img src="${imageUrl}" 
             alt="Project Image ${index + 1}" 
             class="project-media-main"
             style="width: 100%; height: auto; max-height: 70vh; object-fit: contain; border-radius: 12px; background-color: transparent;">
    `;
}

function changeGalleryImage(direction) {
    if (!window.currentGalleryImages || window.currentGalleryImages.length <= 1) return;

    let newIndex = window.currentGalleryIndex + direction;

    // Wrap around
    if (newIndex < 0) newIndex = window.currentGalleryImages.length - 1;
    if (newIndex >= window.currentGalleryImages.length) newIndex = 0;

    window.currentGalleryIndex = newIndex;

    const mainMediaEl = document.getElementById('projectMainMedia') || document.getElementById('projectMediaCarousel')?.parentNode;
    renderGalleryImage(mainMediaEl, window.currentGalleryImages, newIndex);

    // Update counter
    const counter = document.querySelector('.gallery-counter');
    if (counter) {
        counter.textContent = `${newIndex + 1}/${window.currentGalleryImages.length}`;
    }
}

// Legacy helper for backward compatibility
function setMainMedia(element, media) {
    const carousel = document.getElementById('projectMediaCarousel');
    if (!carousel) return;
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
        img.alt = 'Project Image';
        img.style.cssText = 'width: 100%; height: auto; max-height: 70vh; object-fit: contain; border-radius: 12px; background-color: transparent;';
        carousel.appendChild(img);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadFeaturedProjects();
    loadAllProjects();
});

// Global function to update projects language (called from main.js)
window.updateProjectsLanguage = function (lang) {
    if (lang) {
        activeLanguage = lang;
        localStorage.setItem('lang', lang); // Ensure sync
    }

    if (document.getElementById('featuredProjects')) {
        loadFeaturedProjects();
    }
    if (document.getElementById('allProjects')) {
        renderProjects(window.allProjects || []);
    }
};

// Fallback: Listen for event just in case
window.addEventListener('languageChanged', window.updateProjectsLanguage);
