// routes/quiz.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// POST /api/quiz/:noteId/submit -> kvíz beküldése
router.post('/:noteId/submit', auth, quizController.submitQuiz);

// GET /api/quiz/results -> az összes saját kvíz eredmény lekérése
router.get('/results', auth, quizController.getQuizResults);

// GET /api/quiz/:id -> egy adott kvíz eredmény lekérése
router.get('/:id', auth, quizController.getQuizResultById);

module.exports = router;
