/**
 * Contact API Routes - Form Submissions
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Sample messages for demo mode
let sampleMessages = [];

// Check if MongoDB is connected
const isMongoConnected = () => {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1;
};

// POST submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'İsim, email ve mesaj gerekli' });
        }

        if (isMongoConnected()) {
            const Contact = require('../models/Contact');
            const contact = new Contact({ name, email, subject, message });
            await contact.save();
            return res.status(201).json({ message: 'Mesajınız alındı. En kısa sürede dönüş yapacağım!' });
        }

        // Demo mode
        const newMessage = {
            _id: String(Date.now()),
            name,
            email,
            subject,
            message,
            read: false,
            createdAt: new Date()
        };
        sampleMessages.push(newMessage);

        console.log('📧 Yeni mesaj:', newMessage);
        res.status(201).json({ message: 'Mesajınız alındı. En kısa sürede dönüş yapacağım!' });

    } catch (err) {
        res.status(500).json({ message: 'Mesaj gönderilemedi', error: err.message });
    }
});

// GET all messages (Protected - Admin only)
router.get('/', auth, async (req, res) => {
    try {
        if (isMongoConnected()) {
            const Contact = require('../models/Contact');
            const messages = await Contact.find().sort({ createdAt: -1 });
            return res.json(messages);
        }

        // Demo mode
        res.json(sampleMessages);
    } catch (err) {
        res.status(500).json({ message: 'Mesajlar alınamadı', error: err.message });
    }
});

// PUT mark message as read (Protected)
router.put('/:id/read', auth, async (req, res) => {
    try {
        if (isMongoConnected()) {
            const Contact = require('../models/Contact');
            const message = await Contact.findByIdAndUpdate(
                req.params.id,
                { read: true },
                { new: true }
            );
            if (!message) {
                return res.status(404).json({ message: 'Mesaj bulunamadı' });
            }
            return res.json(message);
        }

        // Demo mode
        const index = sampleMessages.findIndex(m => m._id === req.params.id);
        if (index !== -1) {
            sampleMessages[index].read = true;
            return res.json(sampleMessages[index]);
        }
        res.status(404).json({ message: 'Mesaj bulunamadı' });
    } catch (err) {
        res.status(500).json({ message: 'Mesaj güncellenemedi', error: err.message });
    }
});

// DELETE message (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (isMongoConnected()) {
            const Contact = require('../models/Contact');
            const message = await Contact.findByIdAndDelete(req.params.id);
            if (!message) {
                return res.status(404).json({ message: 'Mesaj bulunamadı' });
            }
            return res.json({ message: 'Mesaj silindi' });
        }

        // Demo mode
        const index = sampleMessages.findIndex(m => m._id === req.params.id);
        if (index !== -1) {
            sampleMessages.splice(index, 1);
            return res.json({ message: 'Mesaj silindi' });
        }
        res.status(404).json({ message: 'Mesaj bulunamadı' });
    } catch (err) {
        res.status(500).json({ message: 'Mesaj silinemedi', error: err.message });
    }
});

module.exports = router;
