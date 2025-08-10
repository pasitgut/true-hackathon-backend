const jwt = require('jsonwebtoken');
const pool = require('../db');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Access denied'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [decoded.id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid token'});
        }

        req.user = user.rows[0]
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalide token' });
    }
}


const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')

        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [decoded.id]);
        if (user.rows.length === 0) {
            return next(new Error('Authentication error'));
        }

        socket.userId = decoded.id;
        socket.user = user.rows[0];
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
}

module.exports = { authenticate, authenticateSocket } 