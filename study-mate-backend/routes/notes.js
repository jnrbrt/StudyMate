const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} = require("../controllers/notesController");

// Összes jegyzet
router.get("/", auth, getNotes);

// Egy jegyzet ID alapján
router.get("/:id", auth, getNoteById);

// Új jegyzet létrehozása
router.post("/", auth, createNote);

// Jegyzet frissítése
router.put("/:id", auth, updateNote);

// Jegyzet törlése
router.delete("/:id", auth, deleteNote);

module.exports = router;
