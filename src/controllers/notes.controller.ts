import { Request, Response } from "express";
import {
  fetchAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notes.service.js";
import { logger } from "../logger/logger.js"; // فقط برای خطاهای غیرمنتظره

// GET /notes
export const getNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await fetchAllNotes();
    res.status(200).json(notes);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ message: "GET /notes error", error: msg });
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /notes
export const postNote = async (req: Request, res: Response) => {
  try {
    // req.body قبلاً توسط Middleware validate و parsed شده است
    const { title, content } = req.body;
    const note = await createNote(title, content);
    res.status(201).json(note);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ message: "POST /notes error", error: msg });
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /notes/:id
export const putNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    let note;
    try {
      note = await updateNote(id, title, content);
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Note not found" });
      }
      throw error;
    }

    res.status(200).json(note);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ message: "PUT /notes/:id error", error: msg });
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /notes/:id
export const removeNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let note;
    try {
      note = await deleteNote(id);
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Note not found" });
      }
      throw error;
    }

    res.status(200).json(note);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ message: "DELETE /notes/:id error", error: msg });
    res.status(500).json({ message: "Internal server error" });
  }
};
