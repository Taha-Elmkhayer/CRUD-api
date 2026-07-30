import prisma from "../lib/prisma.js";
import { noteSchema } from "../validators/note.js";

export async function getAllNotes(req, res) {
  try {
    const notes = await prisma.note.findMany({ where: { userId: req.userId } });
    return res.json(notes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
}

export async function getNote(req, res) {
  let note_id = parseInt(req.params.id);

  if (isNaN(note_id)) {
    return res.status(400).json({ Error: "Invalide Id" });
  }

  try {
    let noteObj = await prisma.note.findUnique({
      where: { id: note_id, userId: req.userId },
    });

    if (!noteObj) {
      return res.status(404).json({ Error: "Note not found " });
    }
    return res.json({ note: noteObj });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
}

export async function createNote(req, res) {
  const validation = noteSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: "Title and Content are required" });
  }

  const { title, content } = validation.data;

  try {
    const note = await prisma.note.create({
      data: { title, content, userId: req.userId },
    });
    return res.status(201).json({ note });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
}

export async function updateNote(req, res) {
  const validation = noteSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: "Title and Content are required" });
  }

  const { title, content } = validation.data;

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ Error: "Invalide Id" });
  }

  try {
    const updated_note = await prisma.note.update({
      where: { id, userId: req.userId },
      data: { title, content },
    });
    return res.status(200).json({ updated_note });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ erorr: "Record not Found" });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
}

export async function deleteNote(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ Error: "Invalide Id" });
  }

  try {
    const deleted_note = await prisma.note.delete({
      where: { id, userId: req.userId },
    });
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ erorr: "Record not Found" });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
}
