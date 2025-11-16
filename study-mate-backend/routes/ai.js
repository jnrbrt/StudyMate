const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aiController = require('../controllers/aiController');

// POST /api/ai/summarize
router.post('/summarize', auth, aiController.summarizeNote);

// POST /api/ai/quiz
router.post('/quiz', auth, aiController.generateQuiz);

// GET /api/ai/coach/:userId
router.get('/coach/:userId', auth, aiController.getCoachAdvice);

module.exports = router;
