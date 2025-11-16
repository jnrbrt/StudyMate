// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Regisztráció
exports.register = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    // Ellenőrzés: jelszavak egyeznek-e
    if (password !== passwordConfirm) {
        return res.status(400).json({ msg: 'Passwords do not match' });
    }

    try {
        // Létezik-e már a felhasználó
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        // Jelszó hash-elése
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Új user létrehozása
        const newUser = new User({ name, email, passwordHash });
        await newUser.save();

        // JWT generálása
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: { id: newUser._id, name, email }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Bejelentkezés
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // JWT generálása
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
