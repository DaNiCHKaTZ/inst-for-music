const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config.js');

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('No token found in Authorization header');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, jwtSecret);
            console.log('Decoded JWT:', decoded);
        } catch (err) {
            console.log('JWT verification error:', err);
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        console.log('Request user set:', req.user);

        if (allowedRoles.includes(decoded.role)) {
            console.log('User role authorized:', decoded.role);
            next();
        } else {
            console.log('User role not authorized:', decoded.role);
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
};

module.exports = checkRole;
