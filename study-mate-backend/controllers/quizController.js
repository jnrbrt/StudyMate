// controllers/quizController.js
const QuizResult = require('../models/QuizResult');

// Új kvíz eredmény mentése
exports.submitQuiz = async (req, res) => {
    const { score, answers } = req.body; // frontendből jön: pontszám + válaszok tömb
    const noteId = req.params.noteId;

    try {
        // Új QuizResult létrehozása
        const newResult = new QuizResult({
            userId: req.user.id,
            noteId,
            score,
            answers
        });

        await newResult.save();
        res.json(newResult);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Az összes saját kvíz eredmény lekérése
exports.getQuizResults = async (req, res) => {
    try {
        const results = await QuizResult.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Egy adott kvíz eredmény lekérése ID alapján (opcionális)
exports.getQuizResultById = async (req, res) => {
    try {
        const result = await QuizResult.findById(req.params.id);
        if (!result) return res.status(404).json({ msg: 'Quiz result not found' });
        if (result.userId.toString() !== req.user.id)
            return res.status(401).json({ msg: 'Not authorized' });

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
