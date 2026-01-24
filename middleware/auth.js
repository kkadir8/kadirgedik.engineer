/**
 * Auth Middleware - JWT Token Verification
 */

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Geçersiz token' });
    }
};

module.exports = auth;
