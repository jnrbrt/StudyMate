// controllers/aiController.js
const Note = require('../models/Note');
const AiAdvice = require('../models/AiAdvice');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Összefoglaló generálása egy jegyzethez
exports.summarizeNote = async (req, res) => {
    try {
        const note = await Note.findById(req.body.noteId);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        const prompt = `Készíts rövid, 3 bekezdéses összefoglalót az alábbi jegyzetből:\n\n${note.content}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }]
        });

        const summary = completion.choices[0].message.content;

        note.summary = summary;
        await note.save();

        res.json({ summary });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Kvízkérdések generálása egy jegyzethez
exports.generateQuiz = async (req, res) => {
    try {
        const note = await Note.findById(req.body.noteId);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        const prompt = `Készíts 5 kvízkérdést az alábbi jegyzetből, minden kérdéshez 4 választási lehetőséget adj meg és jelöld meg a helyes választ:\n\n${note.content}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }]
        });

        const quizQuestions = JSON.parse(completion.choices[0].message.content);

        note.quizQuestions = quizQuestions;
        await note.save();

        res.json({ quizQuestions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// AI Study Coach - személyre szabott tanulási javaslat
exports.getCoachAdvice = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Lekérjük az összes kvíz eredményt
        const quizResults = await Note.find({ userId }); // egyszerűsítve jegyzet + kvíz adatok

        const resultsText = quizResults.map(q => `- ${q.title}: ${q.quizQuestions ? q.quizQuestions.length : 0} kérdés`).join('\n');

        const prompt = `A felhasználó eddigi kvíz eredményei:\n${resultsText}\nAdj rövid tanulási javaslatot és 2 gyakorló kérdést a leggyengébb témából.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }]
        });

        const adviceText = completion.choices[0].message.content;

        const advice = new AiAdvice({
            userId,
            adviceText,
            suggestedQuestions: [] // később lehet feldolgozni
        });
        await advice.save();

        res.json({ advice: adviceText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
