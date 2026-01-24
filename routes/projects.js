const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Project model'i import et
let Project;
try {
    Project = require('../models/Project');
} catch (error) {
    console.log('Project model yüklenemedi:', error.message);
}

// Demo projeler (MongoDB bağlantısı yoksa kullanılır)
const demoProjects = [
    {
        id: '1',
        title: 'Loomon Studio',
        title_en: 'Loomon Studio',
        description: 'Yaratıcı tasarım ve AI çözümleri sunan bir stüdyo için modern web sitesi. Minimalist tasarım ve etkileyici animasyonlar.',
        description_en: 'Modern website for a creative design and AI solutions studio. Minimalist design with impressive animations.',
        shortDescription: 'Yaratıcı tasarım ve AI çözümleri stüdyosu',
        shortDescription_en: 'Creative design and AI solutions studio',
        technologies: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Webflow'],
        category: 'web',
        imageUrl: '/media/loomon.studio_site.png',
        liveUrl: 'https://loomon.studio',
        githubUrl: '',
        featured: true,
        order: 1
    },
    {
        id: '2',
        title: 'Protocube 3D Yapılandırıcı',
        title_en: 'Protocube 3D Configurator',
        description: 'Modüler ev konfigürasyonu için interaktif 3D web uygulaması. Three.js ile geliştirilmiş gerçek zamanlı 3D görselleştirme.',
        description_en: 'Interactive 3D web application for modular home configuration. Real-time 3D visualization developed with Three.js.',
        shortDescription: '3D modüler ev yapılandırıcı',
        shortDescription_en: '3D modular home configurator',
        technologies: ['Next.js', 'Three.js', 'React', 'TypeScript', 'Tailwind CSS'],
        category: 'web',
        imageUrl: '/media/protocube_site.png',
        liveUrl: 'https://protocube3d.com',
        githubUrl: '',
        featured: true,
        order: 2
    },
    {
        id: '3',
        title: 'Kerim Gedik Portfolyo',
        title_en: 'Kerim Gedik Portfolio',
        description: 'Profesyonel fotoğrafçı için modern portfolyo sitesi. Galeri yönetimi ve responsive tasarım.',
        description_en: 'Modern portfolio website for a professional photographer. Gallery management and responsive design.',
        shortDescription: 'Profesyonel fotoğrafçı portfolyosu',
        shortDescription_en: 'Professional photographer portfolio',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
        category: 'web',
        imageUrl: '/media/kerimgedik.tech_site.png',
        liveUrl: 'https://kerimgedik.tech',
        githubUrl: '',
        featured: true,
        order: 3
    }
];

// MongoDB bağlantı durumunu kontrol et
const isMongoConnected = () => {
    return mongoose.connection.readyState === 1;
};

// GET /api/projects - Tüm projeleri getir
router.get('/', async (req, res) => {
    try {
        if (isMongoConnected() && Project) {
            const projects = await Project.find().sort({ order: 1, createdAt: -1 });
            res.json(projects);
        } else {
            // Demo mod
            res.json(demoProjects);
        }
    } catch (error) {
        console.error('Projeler getirilirken hata:', error);
        res.json(demoProjects);
    }
});

// GET /api/projects/featured - Öne çıkan projeleri getir
router.get('/featured', async (req, res) => {
    try {
        if (isMongoConnected() && Project) {
            const projects = await Project.find({ featured: true }).sort({ order: 1 }).limit(6);
            res.json(projects);
        } else {
            // Demo mod
            const featured = demoProjects.filter(p => p.featured);
            res.json(featured);
        }
    } catch (error) {
        console.error('Öne çıkan projeler getirilirken hata:', error);
        res.json(demoProjects.filter(p => p.featured));
    }
});

// GET /api/projects/:id - Tek proje getir
router.get('/:id', async (req, res) => {
    try {
        if (isMongoConnected() && Project) {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ error: 'Proje bulunamadı' });
            }
            res.json(project);
        } else {
            // Demo mod
            const project = demoProjects.find(p => p.id === req.params.id);
            if (!project) {
                return res.status(404).json({ error: 'Proje bulunamadı' });
            }
            res.json(project);
        }
    } catch (error) {
        console.error('Proje getirilirken hata:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// POST /api/projects - Yeni proje ekle (Admin)
router.post('/', async (req, res) => {
    try {
        if (!isMongoConnected() || !Project) {
            return res.status(503).json({
                error: 'Veritabanı bağlantısı yok',
                message: 'Demo modunda proje eklenemez'
            });
        }

        const projectData = {
            title: req.body.title,
            title_en: req.body.title_en || req.body.title,
            description: req.body.description,
            description_en: req.body.description_en || req.body.description,
            shortDescription: req.body.shortDescription || req.body.description?.substring(0, 100),
            shortDescription_en: req.body.shortDescription_en || req.body.description_en?.substring(0, 100),
            technologies: req.body.technologies || [],
            category: req.body.category || 'web',
            imageUrl: req.body.imageUrl || '',
            images: req.body.images || [],
            liveUrl: req.body.liveUrl || '',
            githubUrl: req.body.githubUrl || '',
            featured: req.body.featured || false,
            order: req.body.order || 0
        };

        const project = new Project(projectData);
        await project.save();

        res.status(201).json(project);
    } catch (error) {
        console.error('Proje eklenirken hata:', error);
        res.status(500).json({ error: 'Proje eklenirken hata oluştu', details: error.message });
    }
});

// PUT /api/projects/:id - Proje güncelle (Admin)
router.put('/:id', async (req, res) => {
    try {
        if (!isMongoConnected() || !Project) {
            return res.status(503).json({
                error: 'Veritabanı bağlantısı yok',
                message: 'Demo modunda proje güncellenemez'
            });
        }

        const updateData = {};
        const allowedFields = [
            'title', 'title_en', 'description', 'description_en',
            'shortDescription', 'shortDescription_en', 'technologies',
            'category', 'imageUrl', 'images', 'liveUrl', 'githubUrl', 'featured', 'order'
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Proje bulunamadı' });
        }

        res.json(project);
    } catch (error) {
        console.error('Proje güncellenirken hata:', error);
        res.status(500).json({ error: 'Proje güncellenirken hata oluştu', details: error.message });
    }
});

// DELETE /api/projects/:id - Proje sil (Admin)
router.delete('/:id', async (req, res) => {
    try {
        if (!isMongoConnected() || !Project) {
            return res.status(503).json({
                error: 'Veritabanı bağlantısı yok',
                message: 'Demo modunda proje silinemez'
            });
        }

        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Proje bulunamadı' });
        }

        res.json({ message: 'Proje başarıyla silindi', project });
    } catch (error) {
        console.error('Proje silinirken hata:', error);
        res.status(500).json({ error: 'Proje silinirken hata oluştu', details: error.message });
    }
});

module.exports = router;
