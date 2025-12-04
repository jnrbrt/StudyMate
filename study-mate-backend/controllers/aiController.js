const Note = require('../models/Note');
const AiAdvice = require('../models/AiAdvice');
const fetch = require("node-fetch");

// ---------------------------------------------------------
// Gemini API hívás - extra fejlődéssel: NEM dől össze JSON error esetén
// ---------------------------------------------------------
async function callGemini(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );

    const raw = await response.text();
    console.log("Gemini RAW:", raw);

    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        console.error("Gemini JSON parse error:", e);
        return null;
    }

    if (!data?.candidates?.length) {
        console.error("Gemini empty candidates:", data);
        return null;
    }

    return data.candidates[0].content.parts[0].text;
}

// ---------------------------------------------------------
// 1) Új jegyzet generálása szövegből (cím + summary egy hívásban)
// ---------------------------------------------------------
exports.generateNoteFromText = async (req, res) => {
    try {
        const { content, summaryLength } = req.body;
        if (!content) {
            return res.status(400).json({ msg: "Nincs szöveg megadva" });
        }

        const wordCount = content.split(/\s+/).length;

        let percent;
        switch(summaryLength) {
            case "short":
                percent = 15;
                break;
            case "medium":
                percent = 35;
                break;
            case "long":
                percent = 70;
                break;
        }

        const targetWords = Math.max(1, Math.floor(wordCount * (percent / 100)));

        const prompt = `
Kérlek készíts a következő szövegből egy jegyzetet JSON formátumban:
{
  "title": "Rövid cím 4-10 szóban, ami összefoglalja a téma lényegét",
  "summary": "Rövid összefoglaló"
}

Az összefoglaló legyen kb. ${targetWords} szóból, tartalmazza a főbb pontokat, de ne ismételd szó szerint a szöveget.

Szöveg:
${content}

**FONTOS:**  
- Csak a JSON-t add vissza, semmi mást.
- Ne tegyél oda magyarázatot vagy bevezetőt.
`;

        // AI hívás
        let aiResponse = await callGemini(prompt);
        if (!aiResponse) {
            return res.status(500).json({ msg: "Nem sikerült értelmezhető jegyzetet generálni." });
        }

        aiResponse = aiResponse.replace(/```json|```/g, "").trim();

        let data;
        try {
            data = JSON.parse(aiResponse);
        } catch (e) {
            console.error("AI JSON parse error:", e, aiResponse);
            return res.status(500).json({ msg: "Nem sikerült értelmezhető jegyzetet generálni." });
        }

        const note = new Note({
            userId: req.user.id,
            title: data.title || "Névtelen jegyzet",
            content,
            summary: data.summary || ""
        });

        await note.save();

        return res.json(note);
    } catch (err) {
        console.error("Gemini generateNote error:", err);
        return res.status(500).json({ msg: "Server error" });
    }
};

// ---------------------------------------------------------
// 2) Kvízkérdések generálása meglévő jegyzethez
// ---------------------------------------------------------
exports.generateQuiz = async (req, res) => {
    try {
        const note = await Note.findById(req.body.noteId);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        const questionCount = req.body.questionCount || 3;

        const prompt = `
Kérlek készíts ${questionCount} kvízkérdést az alábbi jegyzetből.  
A kimenet legyen **érvényes JSON**, minden kérdésnek legyen 4 válasza (A, B, C, D) és a helyes válasz is szerepeljen:

[
  {
    "question": "Itt jön a kérdés szövege",
    "options": ["A válasz", "B válasz", "C válasz", "D válasz"],
    "correctAnswer": "A" // vagy B, C, D
  }
]

Jegyzet tartalma:
${note.content}

**FONTOS:**  
- Csak a JSON-t add vissza, semmi más.
`;

        let aiResponse = await callGemini(prompt);
        if (!aiResponse) return res.status(500).json({ msg: 'Nem sikerült kvízt generálni.' });

        aiResponse = aiResponse.replace(/```json|```/g, "").trim();

        let quizQuestions;
        try {
            quizQuestions = JSON.parse(aiResponse);
        } catch (e) {
            console.error("Quiz JSON parse error:", e, aiResponse);
            return res.status(500).json({ msg: 'Nem sikerült kvízt generálni.' });
        }

        note.quizQuestions = quizQuestions;
        await note.save();

        res.json({ quizQuestions });
    } catch (err) {
        console.error("Gemini quiz error:", err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ---------------------------------------------------------
// 3) Study Coach tanács
// ---------------------------------------------------------
exports.getCoachAdvice = async (req, res) => {
    try {
        const userId = req.params.userId;

        const results = await Note.find({ userId });

        const resultsText = results
            .map(r => `- ${r.title}: ${r.quizQuestions?.length || 0} kérdés`)
            .join("\n");

        const prompt = `
A felhasználó eddigi kvíz eredményei:
${resultsText}

Adj:
1) Személyre szabott tanulási javaslatot
2) 2 gyakorló kérdést a leggyengébb témából.
`;

        const adviceText = await callGemini(prompt);
        if (!adviceText) return res.status(500).json({ msg: "Nem sikerült tanácsot generálni." });

        const advice = new AiAdvice({
            userId,
            adviceText
        });

        await advice.save();

        res.json({ advice: adviceText });
    } catch (err) {
        console.error("Gemini coach error:", err);
        res.status(500).json({ msg: 'Server error' });
    }
};
