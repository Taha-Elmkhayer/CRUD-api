import prisma from "../lib/prisma.js";
import { noteSchema } from "../validators/note.js";

export async function getAllNotes(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where: { userId: req.userId },
        take: limit,
        skip,
        orderBy: {
          [sort]: order,
        },
      }),
      prisma.note.count({ where: { userId: req.userId } }),
    ]);

    return res.json({
      data: notes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getNote(req, res, next) {
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
    next(error);
  }
}

export async function createNote(req, res, next) {
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
    next(error);
  }
}

export async function updateNote(req, res, next) {
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
    next(error);
  }
}

export async function deleteNote(req, res, next) {
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
    next(error);
  }
}
