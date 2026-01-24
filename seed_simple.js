require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Project = require('./models/Project');

const projects = [
    {
        title: 'Loomon Studio',
        title_en: 'Loomon Studio',
        description: 'Yaratici tasarim ve AI cozumleri sunan bir studyo icin modern web sitesi.',
        description_en: 'Modern website for a creative design and AI solutions studio.',
        shortDescription: 'Yaratici tasarim ve AI cozumleri studyosu',
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
        title: 'Protocube 3D',
        title_en: 'Protocube 3D Configurator',
        description: 'Moduler ev konfigurasyonu icin interaktif 3D web uygulamasi.',
        description_en: 'Interactive 3D web application for modular home configuration.',
        shortDescription: '3D moduler ev yapilandirici',
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
        title: 'Kerim Gedik Portfolio',
        title_en: 'Kerim Gedik Portfolio',
        description: 'Profesyonel fotograf portfolyo sitesi.',
        description_en: 'Professional photographer portfolio.',
        shortDescription: 'Profesyonel fotograf portfolyosu',
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

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // Check for existing admin
        const adminEmail = process.env.ADMIN_EMAIL || 'kadirgedik777@gmail.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin exists:', existingAdmin.email);
        } else {
            const admin = new User({
                email: adminEmail,
                password: 'Admin123!',
                name: 'Kadir Gedik',
                role: 'admin'
            });
            await admin.save();
            console.log('Admin created!');
        }

        // Check for existing projects
        const count = await Project.countDocuments();
        if (count > 0) {
            console.log('Projects exist:', count);
        } else {
            await Project.insertMany(projects);
            console.log('Projects added:', projects.length);
        }

        console.log('Done!');
        console.log('Users:', await User.countDocuments());
        console.log('Projects:', await Project.countDocuments());

    } catch (err) {
        console.log('ERROR:', err.message);
        if (err.errors) {
            for (const key in err.errors) {
                console.log('  Field:', key, 'Message:', err.errors[key].message);
            }
        }
    }

    await mongoose.disconnect();
    process.exit(0);
}

run();
