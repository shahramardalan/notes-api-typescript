import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { NoteService } from "../services/note.service";
import {
  createNoteSchema,
  updateNoteSchema,
} from "../validation/note.validation";
import logger from "../logger/logger";

const noteService = new NoteService();

// گرفتن همه Note های کاربر
export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await noteService.getNotes(req.userId!);
    res.json(notes);
  } catch (error: any) {
    logger.error(error, "Failed to get notes");
    res.status(500).json({ message: "Server error" });
  }
};

// گرفتن یک Note خاص
export const getNoteById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const note = await noteService.getNoteById(id, req.userId!);

    if (!note) {
      logger.warn(`User ${req.userId} tried to access non-existent note ${id}`);
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error: any) {
    logger.error(error, "Failed to get note by id");
    res.status(500).json({ message: "Server error" });
  }
};

// ایجاد Note جدید
export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      logger.error({ errors }, "Validation failed for createNote");
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { title, content } = parsed.data;
    const note = await noteService.createNote(req.userId!, title, content);
    logger.info(`Note created for user ${req.userId}`);
    res.status(201).json(note);
  } catch (error: any) {
    logger.error(error, "Failed to create note");
    res.status(500).json({ message: "Server error" });
  }
};

// به‌روزرسانی Note
export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = updateNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      logger.error({ errors }, "Validation failed for createNote");
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { title, content } = parsed.data;
    const updatedNote = await noteService.updateNote(
      req.params.id,
      req.userId!,
      title!,
      content!
    );

    if (!updatedNote) {
      logger.warn(
        `User ${req.userId} tried to update non-existent or unauthorized note ${req.params.id}`
      );
      return res.status(404).json({ message: "Note not found or not yours" });
    }

    logger.info(`Note ${req.params.id} updated by user ${req.userId}`);
    res.json(updatedNote);
  } catch (error: any) {
    logger.error(error, "Failed to update note");
    res.status(500).json({ message: "Server error" });
  }
};

// حذف Note
export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const deletedNote = await noteService.deleteNote(
      req.params.id,
      req.userId!
    );

    if (!deletedNote) {
      logger.warn(
        `User ${req.userId} tried to delete non-existent or unauthorized note ${req.params.id}`
      );
      return res.status(404).json({ message: "Note not found or not yours" });
    }

    logger.info(`Note ${req.params.id} deleted by user ${req.userId}`);
    res.json({ message: "Note deleted successfully" });
  } catch (error: any) {
    logger.error(error, "Failed to delete note");
    res.status(500).json({ message: "Server error" });
  }
};
