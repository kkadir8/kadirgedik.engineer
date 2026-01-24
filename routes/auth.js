/**
 * Auth API Routes - Login/Register
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Demo admin credentials (for when MongoDB is not connected)
const DEMO_ADMIN = {
    email: 'admin@kadirgedik.engineer',
    password: '$2a$10$XQxzYzJzXN8XDqJ8XjXjXeXjXjXjXjXjXjXjXjXjXjXjXjXjXjXjX', // hashed 'admin123'
    name: 'Kadir Gedik',
    role: 'admin'
};

// Check if MongoDB is connected
const isMongoConnected = () => {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1;
};

// POST Register (one-time setup)
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email ve şifre gerekli' });
        }

        if (isMongoConnected()) {
            const User = require('../models/User');

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
            }

            // Create user
            const user = new User({ email, password, name, role: 'admin' });
            await user.save();

            // Generate token
            const token = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'fallback-secret-key',
                { expiresIn: '7d' }
            );

            return res.status(201).json({
                message: 'Kayıt başarılı',
                token,
                user: { email: user.email, name: user.name, role: user.role }
            });
        }

        // Demo mode - just return success
        res.status(201).json({
            message: 'Demo modda kayıt yapıldı',
            token: 'demo-token',
            user: { email, name: name || 'Admin', role: 'admin' }
        });

    } catch (err) {
        res.status(500).json({ message: 'Kayıt başarısız', error: err.message });
    }
});

// POST Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email ve şifre gerekli' });
        }

        if (isMongoConnected()) {
            const User = require('../models/User');

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Geçersiz email veya şifre' });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Geçersiz email veya şifre' });
            }

            // Generate token
            const token = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'fallback-secret-key',
                { expiresIn: '7d' }
            );

            return res.json({
                message: 'Giriş başarılı',
                token,
                user: { email: user.email, name: user.name, role: user.role }
            });
        }

        // Demo mode - check hardcoded credentials
        if (email === 'admin@kadirgedik.engineer' && password === 'admin123') {
            const token = jwt.sign(
                { userId: 'demo', email, role: 'admin' },
                process.env.JWT_SECRET || 'fallback-secret-key',
                { expiresIn: '7d' }
            );

            return res.json({
                message: 'Giriş başarılı (Demo mod)',
                token,
                user: { email, name: 'Kadir Gedik', role: 'admin' }
            });
        }

        res.status(401).json({ message: 'Geçersiz email veya şifre' });

    } catch (err) {
        res.status(500).json({ message: 'Giriş başarısız', error: err.message });
    }
});

// GET Verify Token
router.get('/verify', (req, res) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ valid: false });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

        res.json({ valid: true, user: decoded });
    } catch (err) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
