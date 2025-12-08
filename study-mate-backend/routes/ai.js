// routes/ai.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aiController = require('../controllers/aiController');

// Egy jegyzet + summary generálása
router.post('/generate', auth, aiController.generateNoteFromText);

// Quiz generálás meglévő jegyzethez
router.post('/quiz', auth, aiController.generateQuiz);

module.exports = router;
