// __tests__/aiController.test.js
jest.mock('../models/Note', () => {
    const m = jest.fn();       // konstruktor: new Note(...)
    m.findById = jest.fn();    // statikus metódus
    return m;
});

jest.mock('node-fetch', () => jest.fn());

const Note = require('../models/Note');
const fetch = require('node-fetch');
const aiController = require('../controllers/aiController');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-gemini-key';
});

//
// generateNoteFromText
//
describe('aiController.generateNoteFromText', () => {
    test('400-at ad, ha nincs content a body-ban', async () => {
        const req = {
            body: { content: '', summaryLength: 'short' },
            user: { id: 'user123' },
        };
        const res = mockResponse();

        await aiController.generateNoteFromText(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Nincs szöveg' });
    });

    test('sikeresen létrehoz egy Note-ot AI válasz alapján', async () => {
        const req = {
            body: {
                content: 'Ez egy teszt szöveg, amit az AI fog összefoglalni.',
                summaryLength: 'short',
            },
            user: { id: 'user123' },
        };
        const res = mockResponse();

        // fetch -> Gemini válasza: sima JSON string (nem Geminis "candidates" struktúra)
        // callGemini ilyenkor a raw szöveget adja vissza, amit a parseJSONSafe szépen parse-ol.
        const aiJson = JSON.stringify({
            title: 'Teszt cím',
            summary: 'Ez egy rövid összefoglaló a bemenet alapján.',
        });

        fetch.mockResolvedValue({
            text: async () => aiJson,
        });

        const saveMock = jest.fn().mockResolvedValue(undefined);
        Note.mockImplementation((data) => ({
            ...data,
            _id: 'note1',
            save: saveMock,
        }));

        await aiController.generateNoteFromText(req, res);

        // Ellenőrizzük, hogy Note-ot a megfelelő adatokkal hozta létre
        expect(Note).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: 'user123',
                title: 'Teszt cím',
                content: expect.stringContaining('Ez egy teszt szöveg'),
                summary: 'Ez egy rövid összefoglaló a bemenet alapján.',
            })
        );
        expect(saveMock).toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                _id: 'note1',
                userId: 'user123',
                title: 'Teszt cím',
            })
        );
    });

    test('500-at ad, ha az AI nem ad érvényes JSON-t (parseJSONSafe nullt ad)', async () => {
        const req = {
            body: {
                content: 'Valami szöveg',
                summaryLength: 'short',
            },
            user: { id: 'user123' },
        };
        const res = mockResponse();

        // olyan szöveg, ami biztosan nem JSON → parseJSONSafe minden próbálkozásra null
        fetch.mockResolvedValue({
            text: async () => 'NEM JSON VÁLASZ',
        });

        await aiController.generateNoteFromText(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'AI hibás JSON-t adott vissza.',
        });
    });

    test('500-at ad, ha váratlan hiba történik (pl. Note.save dob)', async () => {
        const req = {
            body: {
                content: 'Valami szöveg',
                summaryLength: 'short',
            },
            user: { id: 'user123' },
        };
        const res = mockResponse();

        const aiJson = JSON.stringify({
            title: 'Teszt',
            summary: 'Összefoglaló',
        });

        fetch.mockResolvedValue({
            text: async () => aiJson,
        });

        const saveMock = jest.fn().mockRejectedValue(new Error('DB error'));
        Note.mockImplementation((data) => ({
            ...data,
            save: saveMock,
        }));

        await aiController.generateNoteFromText(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
});

//
// generateQuiz
//
describe('aiController.generateQuiz', () => {
    test('404-et ad, ha a Note nem található', async () => {
        const req = {
            body: { noteId: 'note123' },
            user: { id: 'user123' },
        };
        const res = mockResponse();

        Note.findById.mockResolvedValue(null);

        await aiController.generateQuiz(req, res);

        expect(Note.findById).toHaveBeenCalledWith('note123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Note not found' });
    });

    test('sikeres kvíz generáláskor 30 kérdést ad vissza és menti a Note-ba', async () => {
        const req = {
            body: { noteId: 'note123' },
            user: { id: 'user123' },
        };
        const res = mockResponse();

        const saveMock = jest.fn().mockResolvedValue(undefined);
        const note = {
            _id: 'note123',
            summary: 'Ez egy összefoglaló, amiből kérdések készülnek.',
            quizQuestions: [],
            save: saveMock,
        };

        Note.findById.mockResolvedValue(note);

        // 30 kérdés generálása
        const questions = Array.from({ length: 30 }, (_, i) => ({
            question: `Kérdés ${i + 1}?`,
            options: ['A', 'B', 'C', 'D'],
            correctAnswer: 'A',
        }));

        // fetch → JSON tömb string
        const aiJsonArray = JSON.stringify(questions);

        fetch.mockResolvedValue({
            text: async () => aiJsonArray,
        });

        await aiController.generateQuiz(req, res);

        // Note-ot frissítette
        expect(note.quizQuestions).toEqual(questions);
        expect(saveMock).toHaveBeenCalled();

        // Response-ban is benne van
        expect(res.json).toHaveBeenCalledWith({
            quizQuestions: questions,
        });
    });

    test('500-at ad, ha az AI nem 30 kérdést ad vissza', async () => {
        const req = {
            body: { noteId: 'note123' },
            user: { id: 'user123' },
        };
        const res = mockResponse();

        const saveMock = jest.fn().mockResolvedValue(undefined);
        const note = {
            _id: 'note123',
            summary: 'Valami összefoglaló',
            quizQuestions: [],
            save: saveMock,
        };

        Note.findById.mockResolvedValue(note);

        // csak 1 kérdés → nem 30
        const badQuestions = [
            { question: 'Csak egy kérdés', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
        ];

        fetch.mockResolvedValue({
            text: async () => JSON.stringify(badQuestions),
        });

        await aiController.generateQuiz(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'AI hibás kérdéssort adott vissza.',
        });
        // ilyen esetben ne mentsen
        expect(saveMock).not.toHaveBeenCalled();
    });

    test('500-at ad, ha váratlan hiba történik (pl. findById rejectál)', async () => {
        const req = {
            body: { noteId: 'note123' },
            user: { id: 'user123' },
        };
        const res = mockResponse();

        Note.findById.mockRejectedValue(new Error('DB error'));

        await aiController.generateQuiz(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Server error',
        });
    });
});
