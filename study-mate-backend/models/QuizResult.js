// models/QuizResult.js
const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    score: { type: Number, required: true },
    answers: [
        {
            questionId: String,
            selectedAnswer: String
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
