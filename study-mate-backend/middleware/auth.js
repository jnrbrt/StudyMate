// middleware/auth.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token'); // frontendből küldjük a fejlécekben
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // a middleware után a req.user-ben lesz a userId
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;
