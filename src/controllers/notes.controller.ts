// src/controllers/notes.controller.ts
import { Request, Response } from "express";
import {
  fetchAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notes.service.js";
import {
  createNoteSchema,
  updateNoteSchema,
} from "../validators/note.validator.js";
import { logger } from "../logger/logger.js";

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await fetchAllNotes();
    res.status(200).json(notes);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ message: "GET /notes error", error: msg });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postNote = async (req: Request, res: Response) => {
  try {
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      logger.warn({ message: "Validation failed", issues });
      return res.status(400).json({ errors: issues });
    }

    const note = await createNote(parsed.data.title, parsed.data.content);
    logger.info({ message: "Note created", noteId: note.id });
    res.status(201).json(note);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ message: "POST /notes error", error: msg });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const putNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      logger.warn({ message: "Validation failed", issues });
      return res.status(400).json({ errors: issues });
    }

    let note;
    try {
      note = await updateNote(id, parsed.data.title, parsed.data.content);
    } catch (error: any) {
      if (error.code === "P2025") {
        logger.warn({ message: "Note not found", noteId: id });
        return res.status(404).json({ message: "Note not found" });
      }
      throw error;
    }

    logger.info({ message: "Note updated", noteId: note!.id });
    res.status(200).json(note);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ message: "PUT /notes/:id error", error: msg });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let note;
    try {
      note = await deleteNote(id);
    } catch (error: any) {
      if (error.code === "P2025") {
        logger.warn({ message: "Note not found", noteId: id });
        return res.status(404).json({ message: "Note not found" });
      }
      throw error;
    }

    logger.info({ message: "Note deleted", noteId: note!.id });
    res.status(200).json(note);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ message: "DELETE /notes/:id error", error: msg });
    res.status(500).json({ message: "Internal server error" });
  }
};
