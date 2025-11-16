// controllers/notesController.js
const Note = require('../models/Note');

// Összes saját jegyzet lekérése
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Egy jegyzet lekérése
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        if (note.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Új jegyzet létrehozása
exports.createNote = async (req, res) => {
    const { title, content } = req.body;
    try {
        const newNote = new Note({
            userId: req.user.id,
            title,
            content
        });
        await newNote.save();
        res.json(newNote);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Jegyzet frissítése
exports.updateNote = async (req, res) => {
    const { title, content } = req.body;
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        if (note.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        note.title = title || note.title;
        note.content = content || note.content;

        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Jegyzet törlése
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        if (note.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await note.remove();
        res.json({ msg: 'Note removed' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
