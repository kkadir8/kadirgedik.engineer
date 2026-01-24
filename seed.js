/**
 * MongoDB Seed Script
 * Bu script ilk kez çalıştırıldığında:
 * 1. Admin kullanıcı oluşturur
 * 2. Demo projeleri veritabanına ekler
 * 
 * Kullanım: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Project = require('./models/Project');

// Başlangıç projeleri
const initialProjects = [
    {
        title: 'Loomon Studio',
        title_en: 'Loomon Studio',
        description: 'Yaratıcı tasarım ve AI çözümleri sunan bir stüdyo için modern web sitesi. Minimalist tasarım ve etkileyici animasyonlar.',
        description_en: 'Modern website for a creative design and AI solutions studio. Minimalist design with impressive animations.',
        shortDescription: 'Yaratıcı tasarım ve AI çözümleri stüdyosu',
        shortDescription_en: 'Creative design and AI solutions studio',
        technologies: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Webflow'],
        category: 'web-development',
        imageUrl: '/media/loomon.studio_site.png',
        liveUrl: 'https://loomon.studio',
        githubUrl: '',
        featured: true,
        order: 1
    },
    {
        title: 'Protocube 3D Yapılandırıcı',
        title_en: 'Protocube 3D Configurator',
        description: 'Modüler ev konfigürasyonu için interaktif 3D web uygulaması. Three.js ile geliştirilmiş gerçek zamanlı 3D görselleştirme.',
        description_en: 'Interactive 3D web application for modular home configuration. Real-time 3D visualization developed with Three.js.',
        shortDescription: '3D modüler ev yapılandırıcı',
        shortDescription_en: '3D modular home configurator',
        technologies: ['Next.js', 'Three.js', 'React', 'TypeScript', 'Tailwind CSS'],
        category: 'web-development',
        imageUrl: '/media/protocube_site.png',
        liveUrl: 'https://protocube3d.com',
        githubUrl: '',
        featured: true,
        order: 2
    },
    {
        title: 'Kerim Gedik Portfolyo',
        title_en: 'Kerim Gedik Portfolio',
        description: 'Profesyonel fotoğrafçı için modern portfolyo sitesi. Galeri yönetimi ve responsive tasarım.',
        description_en: 'Modern portfolio website for a professional photographer. Gallery management and responsive design.',
        shortDescription: 'Profesyonel fotoğrafçı portfolyosu',
        shortDescription_en: 'Professional photographer portfolio',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
        category: 'web-development',
        imageUrl: '/media/kerimgedik.tech_site.png',
        liveUrl: 'https://kerimgedik.tech',
        githubUrl: '',
        featured: true,
        order: 3
    }
];

async function seed() {
    try {
        // MongoDB'ye bağlan
        console.log('📡 MongoDB\'ye bağlanılıyor...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB bağlantısı başarılı!');

        // Admin kullanıcı oluştur
        console.log('\n👤 Admin kullanıcı kontrol ediliyor...');
        const adminEmail = process.env.ADMIN_EMAIL || 'kadirgedik777@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
        console.log('   Email:', adminEmail);
        console.log('   Password length:', adminPassword.length);

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('ℹ️  Admin kullanıcı zaten mevcut:', existingAdmin.email);
        } else {
            try {
                const admin = new User({
                    email: adminEmail,
                    password: adminPassword,
                    name: 'Kadir Gedik',
                    role: 'admin'
                });
                await admin.save();
                console.log('✅ Admin kullanıcı oluşturuldu:', admin.email);
            } catch (userError) {
                console.error('❌ Admin kullanıcı oluşturma hatası:', userError.message);
                if (userError.errors) {
                    Object.keys(userError.errors).forEach(key => {
                        console.error('   - ' + key + ': ' + userError.errors[key].message);
                    });
                }
            }
        }

        // Projeleri ekle
        console.log('\n📁 Projeler kontrol ediliyor...');
        const existingProjects = await Project.countDocuments();

        if (existingProjects > 0) {
            console.log(`ℹ️  Veritabanında ${existingProjects} proje zaten mevcut.`);
            console.log('   Mevcut projeleri silip yeniden eklemek için: node seed.js --force');

            if (process.argv.includes('--force')) {
                console.log('⚠️  --force flag kullanıldı. Mevcut projeler siliniyor...');
                await Project.deleteMany({});
                console.log('🗑️  Mevcut projeler silindi.');

                await Project.insertMany(initialProjects);
                console.log(`✅ ${initialProjects.length} proje eklendi.`);
            }
        } else {
            await Project.insertMany(initialProjects);
            console.log(`✅ ${initialProjects.length} proje eklendi.`);
        }

        // Sonuç özeti
        console.log('\n========================================');
        console.log('🎉 Seed işlemi tamamlandı!');
        console.log('========================================');
        console.log('\n📊 Veritabanı Durumu:');
        console.log(`   - Toplam Kullanıcı: ${await User.countDocuments()}`);
        console.log(`   - Toplam Proje: ${await Project.countDocuments()}`);
        console.log('\n🔐 Admin Giriş Bilgileri:');
        console.log(`   - Email: ${process.env.ADMIN_EMAIL || 'kadirgedik777@gmail.com'}`);
        console.log(`   - Şifre: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
        console.log('\n🚀 Sunucuyu başlatmak için: node server.js');
        console.log('🔗 Admin panel: http://localhost:3000/admin.html');

    } catch (error) {
        console.error('❌ Seed hatası:', error.message);
        console.error(error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 MongoDB bağlantısı kapatıldı.');
        process.exit(0);
    }
}

// Script'i çalıştır
seed();
