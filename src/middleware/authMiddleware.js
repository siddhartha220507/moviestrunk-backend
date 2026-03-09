const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model.js');

const protect = async (req, res, next) => {
    let token;

    // First check if token exists in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } 
    // Fallback: check Authorization header
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'fallback_secret_key');

        // Get user from the token (exclude password)
        req.user = await userModel.findById(decoded.id).select('-password');

        if (!req.user) {
             return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        if (req.user.isBanned) {
             return res.status(403).json({ message: 'Your account has been banned by an administrator.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };
