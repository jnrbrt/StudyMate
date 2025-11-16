const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notesController = require('../controllers/notesController');

// GET /api/notes
router.get('/', auth, notesController.getNotes);

// GET /api/notes/:id
router.get('/:id', auth, notesController.getNoteById);

// POST /api/notes
router.post('/', auth, notesController.createNote);

// PUT /api/notes/:id
router.put('/:id', auth, notesController.updateNote);

// DELETE /api/notes/:id
router.delete('/:id', auth, notesController.deleteNote);

module.exports = router;
