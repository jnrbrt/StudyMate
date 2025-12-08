// controllers/aiController.js
const Note = require('../models/Note');
const fetch = require("node-fetch");

/* ---------------------------------------------------------
   1) INPUT CLEANING – megbízhatóbb, nem tör túl sokat
--------------------------------------------------------- */
function cleanInputText(text) {
    if (!text) return "";

    return text
        .replace(/\u0000/g, "")           // null byte
        .replace(/<[^>]*>/g, "")          // HTML tagek
        .replace(/\s{2,}/g, " ")          // több space -> 1 space
        .trim();
}

/* ---------------------------------------------------------
   2) SZUPER BIZTOS JSON PARSER (nem tördel széjjel JSON-t)
--------------------------------------------------------- */
function parseJSONSafe(raw) {
    if (!raw) return null;

    // Ha elsőre jó → vissza
    try {
        return JSON.parse(raw);
    } catch (_) {}

    // Kinyerjük a legnagyobb JSON blokkot
    const match = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!match) return null;

    const jsonCandidate = match[1]
        .replace(/,\s*([}\]])/g, "$1"); // trailing comma fix

    try {
        return JSON.parse(jsonCandidate);
    } catch (e) {
        console.error("parseJSONSafe ERROR:", e);
        console.error("Candidate:", jsonCandidate);
        return null;
    }
}

/* ---------------------------------------------------------
   3) GEMINI HÍVÁS – csak sima textet kapunk
--------------------------------------------------------- */
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

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return raw;
    }

    const parts = parsed?.candidates?.[0]?.content?.parts;
    if (!parts) return raw;

    let text = parts.map(p => p.text || "").join("");

    // Markdown eltávolítás
    return text.replace(/```json|```/g, "").trim();
}

/* ---------------------------------------------------------
   4) RETRY – minden körben teljes JSON kinyerést próbál
--------------------------------------------------------- */
async function callGeminiWithRetry(prompt, retries = 3) {
    for (let i = 0; i < retries; i++) {
        const raw = await callGemini(prompt);
        const json = parseJSONSafe(raw);

        if (json) return json;
    }
    return null;
}

/* ---------------------------------------------------------
   5) SUMMARY GENERÁLÁS – stabil szószám, nem vágja rövidre
--------------------------------------------------------- */
exports.generateNoteFromText = async (req, res) => {
    try {
        const { content, summaryLength } = req.body;
        if (!content) return res.status(400).json({ msg: "Nincs szöveg" });

        const cleaned = cleanInputText(content);
        const wordCount = cleaned.split(/\s+/).length;

        let percent =
            summaryLength === "short" ? 25 :
                summaryLength === "medium" ? 45 :
                    summaryLength === "long" ? 70 : 40;

        const targetWords = Math.max(120, Math.floor(wordCount * percent / 100));
        const minWords = Math.floor(targetWords * 0.85);
        const maxWords = Math.floor(targetWords * 1.15);

        const prompt = `
Adj vissza kizárólag érvényes JSON-t:

{
  "title": "4-10 szavas cím",
  "summary": "összefoglaló"
}

KÖTELEZŐ SZABÁLYOK:
- A summary legalább ${minWords} szó
- De nem lehet hosszabb mint ${maxWords} szó
- Ha eléred a maximumot, fejezd be a mondatot
- Ne ismételj!
- Ne írj semmi extrát a JSON elé vagy mögé!

SZÖVEG:
${cleaned}
`;

        const data = await callGeminiWithRetry(prompt);

        if (!data || typeof data !== "object") {
            return res.status(500).json({ msg: "AI hibás JSON-t adott vissza." });
        }

        const note = new Note({
            userId: req.user.id,
            title: data.title || "Névtelen jegyzet",
            content: cleaned,
            summary: data.summary || ""
        });

        await note.save();
        res.json(note);

    } catch (err) {
        console.error("generateNoteFromText ERROR:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

/* ---------------------------------------------------------
   6) KVÍZ GENERÁLÁS – stabilizált kérdésszám, robusztus JSON
--------------------------------------------------------- */
exports.generateQuiz = async (req, res) => {
    try {
        const note = await Note.findById(req.body.noteId);
        if (!note) return res.status(404).json({ msg: "Note not found" });

        const summary = cleanInputText(note.summary);
        const questionCount = 30;

        const prompt = `
Adj vissza kizárólag JSON listát:

[
  { "question": "?", "options": ["A","B","C","D"], "correctAnswer": "A" }
]

SZABÁLYOK:
- Pontosan ${questionCount} kérdés
- Csak a SUMMARY-ből dolgozhatsz
- Nincs extra szöveg vagy komment

SUMMARY:
${summary}
`;

        const data = await callGeminiWithRetry(prompt);

        if (!Array.isArray(data) || data.length !== questionCount) {
            return res.status(500).json({ msg: "AI hibás kérdéssort adott vissza." });
        }

        note.quizQuestions = data;
        await note.save();

        res.json({ quizQuestions: data });

    } catch (err) {
        console.error("generateQuiz ERROR:", err);
        res.status(500).json({ msg: "Server error" });
    }
};
