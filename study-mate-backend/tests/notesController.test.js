// tests/notesController.test.js
jest.mock('../models/Note', () => {
    // konstruktor + statikus metódusok
    const m = jest.fn();
    m.find = jest.fn();
    m.findById = jest.fn();
    m.findByIdAndDelete = jest.fn();
    return m;
});

const Note = require('../models/Note');
const notesController = require('../controllers/notesController');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
});

//
// getNotes
//
describe('notesController.getNotes', () => {
    test('visszaadja a bejelentkezett user jegyzeteit', async () => {
        const req = { user: { id: 'user123' } };
        const res = mockResponse();

        const fakeNotes = [
            { _id: 'n1', title: 'A', content: 'C1' },
            { _id: 'n2', title: 'B', content: 'C2' },
        ];

        const sortMock = jest.fn().mockResolvedValue(fakeNotes);
        Note.find.mockReturnValue({ sort: sortMock });

        await notesController.getNotes(req, res);

        expect(Note.find).toHaveBeenCalledWith({ userId: 'user123' });
        expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
        expect(res.json).toHaveBeenCalledWith(fakeNotes);
    });

    test('500-at ad, ha hiba történik', async () => {
        const req = { user: { id: 'user123' } };
        const res = mockResponse();

        const sortMock = jest.fn().mockRejectedValue(new Error('DB error'));
        Note.find.mockReturnValue({ sort: sortMock });

        await notesController.getNotes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'DB error' });
    });
});

//
// getNoteById
//
describe('notesController.getNoteById', () => {
    test('404-et ad, ha a jegyzet nem létezik', async () => {
        const req = { params: { id: 'note1' }, user: { id: 'user123' } };
        const res = mockResponse();

        Note.findById.mockResolvedValue(null);

        await notesController.getNoteById(req, res);

        expect(Note.findById).toHaveBeenCalledWith('note1');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Note not found' });
    });

    test('401-et ad, ha nem a user jegyzete', async () => {
        const req = { params: { id: 'note1' }, user: { id: 'user123' } };
        const res = mockResponse();

        const note = {
            _id: 'note1',
            userId: 'otherUser',
            toString: Object.prototype.toString,
        };

        Note.findById.mockResolvedValue(note);

        await notesController.getNoteById(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Not authorized' });
    });

    test('siker esetén visszaadja a jegyzetet', async () => {
        const req = { params: { id: 'note1' }, user: { id: 'user123' } };
        const res = mockResponse();

        const note = {
            _id: 'note1',
            title: 'Cím',
            content: 'Tartalom',
            userId: 'user123',
        };

        Note.findById.mockResolvedValue(note);

        await notesController.getNoteById(req, res);

        expect(res.json).toHaveBeenCalledWith(note);
    });

    test('500-at ad, ha hiba történik', async () => {
        const req = { params: { id: 'note1' }, user: { id: 'user123' } };
        const res = mockResponse();

        Note.findById.mockRejectedValue(new Error('DB error'));

        await notesController.getNoteById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'DB error' });
    });
});

//
// createNote
//
describe('notesController.createNote', () => {
    test('siker esetén létrehozza és visszaadja a jegyzetet', async () => {
        const req = {
            user: { id: 'user123' },
            body: { title: 'Cím', content: 'Tartalom' },
        };
        const res = mockResponse();

        const saveMock = jest.fn().mockResolvedValue(undefined);
        Note.mockImplementation((data) => ({
            ...data,
            _id: 'note1',
            save: saveMock,
        }));

        await notesController.createNote(req, res);

        expect(Note).toHaveBeenCalledWith({
            userId: 'user123',
            title: 'Cím',
            content: 'Tartalom',
        });
        expect(saveMock).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                _id: 'note1',
                userId: 'user123',
                title: 'Cím',
                content: 'Tartalom',
            })
        );
    });

    test('500-at ad, ha hiba történik mentéskor', async () => {
        const req = {
            user: { id: 'user123' },
            body: { title: 'Cím', content: 'Tartalom' },
        };
        const res = mockResponse();

        const saveMock = jest.fn().mockRejectedValue(new Error('DB error'));
        Note.mockImplementation((data) => ({
            ...data,
            save: saveMock,
        }));

        await notesController.createNote(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'DB error' });
    });
});

//
// updateNote
//
describe('notesController.updateNote', () => {
    test('404-et ad, ha a jegyzet nem létezik', async () => {
        const req = {
            params: { id: 'note1' },
            user: { id: 'user123' },
            body: { title: 'Új cím', content: 'Új tartalom' },
        };
        const res = mockResponse();

        Note.findById.mockResolvedValue(null);

        await notesController.updateNote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Note not found' });
    });

    test('401-et ad, ha nem a user jegyzete', async () => {
        const req = {
            params: { id: 'note1' },
            user: { id: 'user123' },
            body: { title: 'Új cím', content: 'Új tartalom' },
        };
        const res = mockResponse();

        const note = {
            _id: 'note1',
            userId: 'otherUser',
        };

        Note.findById.mockResolvedValue(note);

        await notesController.updateNote(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Not authorized' });
    });

    test('siker esetén frissíti és visszaadja a jegyzetet', async () => {
        const req = {
            params: { id: 'note1' },
            user: { id: 'user123' },
            body: { title: 'Új cím', content: 'Új tartalom' },
        };
        const res = mockResponse();

        const saveMock = jest.fn().mockResolvedValue(undefined);
        const note = {
            _id: 'note1',
            userId: 'user123',
            title: 'Régi cím',
            content: 'Régi tartalom',
            save: saveMock,
        };

        Note.findById.mockResolvedValue(note);

        await notesController.updateNote(req, res);

        expect(note.title).toBe('Új cím');
        expect(note.content).toBe('Új tartalom');
        expect(saveMock).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(note);
    });

    test('500-at ad, ha hiba történik', async () => {
        const req = {
            params: { id: 'note1' },
            user: { id: 'user123' },
            body: { title: 'Új cím', content: 'Új tartalom' },
        };
        const res = mockResponse();

        Note.findById.mockRejectedValue(new Error('DB error'));

        await notesController.updateNote(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'DB error' });
    });
});

//
// deleteNote
//
describe('notesController.deleteNote', () => {
    test('404-et ad, ha a jegyzet nem létezik', async () => {
        const req = { params: { id: 'note1' }, user: { id: 'user123' } };
        const res = mockResponse();

        Note.findById.mockResolvedValue(null);

        await notesController.deleteNote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Note not found' });
    });

    test('401-et ad, ha nem a user jegyzete', async () => {
        const req = { params: { id: 'note1' }, user: { id: 'user123' } };
        const res = mockResponse();

        Note.findById.mockResolvedValue({ _id: 'note1', userId: 'otherUser' });

        await notesController.deleteNote(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Not authorized' });
    });

    test('siker esetén törli a jegyzetet és visszaad egy üzenetet', async () => {
        const req = { params: { id: 'note1' }, user: { id: 'user123' } };
        const res = mockResponse();

        Note.findById.mockResolvedValue({ _id: 'note1', userId: 'user123' });
        Note.findByIdAndDelete.mockResolvedValue(undefined);

        await notesController.deleteNote(req, res);

        expect(Note.findByIdAndDelete).toHaveBeenCalledWith('note1');
        expect(res.json).toHaveBeenCalledWith({ msg: 'Note removed' });
    });

    test('500-at ad, ha hiba történik', async () => {
        const req = { params: { id: 'note1' }, user: { id: 'user123' } };
        const res = mockResponse();

        Note.findById.mockRejectedValue(new Error('DB error'));

        await notesController.deleteNote(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'DB error' });
    });
});
