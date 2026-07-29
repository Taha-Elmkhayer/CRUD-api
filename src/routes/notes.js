import express from "express";
import * as notesController from "../controller/notes.js";

const router = express.Router();

router.get("/", notesController.getAllNotes);
router.post("/", notesController.createNote);
router.get("/:id", notesController.getNote);
router.put("/:id", notesController.updateNote);
router.delete("/:id", notesController.deleteNote);

export default router;
