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

export const updateNote = async (
  id: string,
  title: string,
  content: string
): Promise<Note | null> => {
  return prisma.note.update({
    where: { id },
    data: { title, content, updatedAt: new Date() },
  });
};

export const deleteNote = async (id: string): Promise<Note | null> => {
  return prisma.note.delete({
    where: { id },
  });
};
