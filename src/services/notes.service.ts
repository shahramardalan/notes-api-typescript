import { Note } from "../models/note.model";

let notes: Note[] = [];

export const fetchAllNotes = async (): Promise<Note[]> => {
  return notes;
};

export const createNote = async (
  title: string,
  content: string
): Promise<Note> => {
  const newNote: Note = {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: new Date(),
  };

  notes.push(newNote);
  return newNote;
};
