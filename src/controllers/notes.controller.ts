import { Request, Response } from "express";
import { fetchAllNotes, createNote } from "../services/notes.service";

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await fetchAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "title and content are required" });
    }

    const note = await createNote(title, content);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
