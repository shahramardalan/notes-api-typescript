import { prisma } from "../db";
import { Note } from "../models/note.model";

export const fetchAllNotes = async (): Promise<Note[]> => {
  return prisma.note.findMany();
};

export const createNote = async (
  title: string,
  content: string
): Promise<Note> => {
  return prisma.note.create({
    data: { title, content },
  });
};
