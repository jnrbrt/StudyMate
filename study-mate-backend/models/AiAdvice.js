const mongoose = require('mongoose');

const SuggestedQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true }
});

const AiAdviceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adviceText: { type: String, required: true },
    suggestedQuestions: [SuggestedQuestionSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AiAdvice', AiAdviceSchema);
