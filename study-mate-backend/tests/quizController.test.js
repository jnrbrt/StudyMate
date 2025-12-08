// __tests__/quizController.test.js
jest.mock('../models/QuizResult', () => {
    const m = jest.fn();          // konstruktor (new QuizResult(...))
    m.find = jest.fn();           // statikus metódusok
    m.findById = jest.fn();
    return m;
});

const QuizResult = require('../models/QuizResult');
const quizController = require('../controllers/quizController');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
});

//
// submitQuiz
//
describe('quizController.submitQuiz', () => {
    test('sikeresen elmenti az új kvíz eredményt és visszaadja', async () => {
        const req = {
            params: { noteId: 'note123' },
            user: { id: 'user123' },
            body: {
                score: 80,
                answers: [
                    { questionId: 'q1', correct: true },
                    { questionId: 'q2', correct: false },
                ],
            },
        };
        const res = mockResponse();

        const saveMock = jest.fn().mockResolvedValue(undefined);
        const fakeResult = {
            _id: 'result1',
            userId: 'user123',
            noteId: 'note123',
            score: 80,
            answers: req.body.answers,
            save: saveMock,
        };

        QuizResult.mockImplementation((data) => ({
            ...data,
            _id: 'result1',
            save: saveMock,
        }));

        await quizController.submitQuiz(req, res);

        expect(QuizResult).toHaveBeenCalledWith({
            userId: 'user123',
            noteId: 'note123',
            score: 80,
            answers: req.body.answers,
        });
        expect(saveMock).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                _id: 'result1',
                userId: 'user123',
                noteId: 'note123',
                score: 80,
                answers: req.body.answers,
            })
        );
    });

    test('500-at ad, ha mentés közben hiba történik', async () => {
        const req = {
            params: { noteId: 'note123' },
            user: { id: 'user123' },
            body: { score: 50, answers: [] },
        };
        const res = mockResponse();

        const saveMock = jest.fn().mockRejectedValue(new Error('DB error'));
        QuizResult.mockImplementation((data) => ({
            ...data,
            save: saveMock,
        }));

        await quizController.submitQuiz(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
});

//
// getQuizResults
//
describe('quizController.getQuizResults', () => {
    test('visszaadja a bejelentkezett user összes kvíz eredményét', async () => {
        const req = { user: { id: 'user123' } };
        const res = mockResponse();

        const fakeResults = [
            { _id: 'r1', userId: 'user123', score: 80 },
            { _id: 'r2', userId: 'user123', score: 60 },
        ];

        const sortMock = jest.fn().mockResolvedValue(fakeResults);
        QuizResult.find.mockReturnValue({ sort: sortMock });

        await quizController.getQuizResults(req, res);

        expect(QuizResult.find).toHaveBeenCalledWith({ userId: 'user123' });
        expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
        expect(res.json).toHaveBeenCalledWith(fakeResults);
    });

    test('500-at ad, ha lekérdezés közben hiba történik', async () => {
        const req = { user: { id: 'user123' } };
        const res = mockResponse();

        const sortMock = jest.fn().mockRejectedValue(new Error('DB error'));
        QuizResult.find.mockReturnValue({ sort: sortMock });

        await quizController.getQuizResults(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
});

//
// getQuizResultById
//
describe('quizController.getQuizResultById', () => {
    test('404-et ad, ha az eredmény nem létezik', async () => {
        const req = { params: { id: 'res1' }, user: { id: 'user123' } };
        const res = mockResponse();

        QuizResult.findById.mockResolvedValue(null);

        await quizController.getQuizResultById(req, res);

        expect(QuizResult.findById).toHaveBeenCalledWith('res1');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Quiz result not found' });
    });

    test('401-et ad, ha nem a bejelentkezett user eredménye', async () => {
        const req = { params: { id: 'res1' }, user: { id: 'user123' } };
        const res = mockResponse();

        const result = {
            _id: 'res1',
            userId: { toString: () => 'otherUser' },
        };

        QuizResult.findById.mockResolvedValue(result);

        await quizController.getQuizResultById(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Not authorized' });
    });

    test('siker esetén visszaadja az eredményt', async () => {
        const req = { params: { id: 'res1' }, user: { id: 'user123' } };
        const res = mockResponse();

        const result = {
            _id: 'res1',
            userId: { toString: () => 'user123' },
            score: 90,
            answers: [],
        };

        QuizResult.findById.mockResolvedValue(result);

        await quizController.getQuizResultById(req, res);

        expect(res.json).toHaveBeenCalledWith(result);
    });

    test('500-at ad, ha hiba történik lekérdezés közben', async () => {
        const req = { params: { id: 'res1' }, user: { id: 'user123' } };
        const res = mockResponse();

        QuizResult.findById.mockRejectedValue(new Error('DB error'));

        await quizController.getQuizResultById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
});
