import { prisma } from "../db/index.js";
import { Note } from "../models/note.model.js";

// گرفتن همه یادداشت‌ها
export const fetchAllNotes = async (): Promise<Note[]> => {
  const notes = await prisma.note.findMany();

  // تبدیل updatedAt null به undefined برای همخوانی با مدل
  return notes.map((n) => ({
    ...n,
    updatedAt: n.updatedAt ?? undefined,
  }));
};

// ایجاد یک یادداشت جدید
export const createNote = async (
  title: string,
  content: string
): Promise<Note> => {
  const note = await prisma.note.create({
    data: { title, content },
  });

  return {
    ...note,
    updatedAt: note.updatedAt ?? undefined,
  };
};

// آپدیت یادداشت با id
export const updateNote = async (
  id: string,
  title: string,
  content: string
): Promise<Note> => {
  const note = await prisma.note.update({
    where: { id },
    data: { title, content, updatedAt: new Date() },
  });

  return {
    ...note,
    updatedAt: note.updatedAt ?? undefined,
  };
};

// حذف یادداشت با id
export const deleteNote = async (id: string): Promise<Note> => {
  const note = await prisma.note.delete({
    where: { id },
  });

  return {
    ...note,
    updatedAt: note.updatedAt ?? undefined,
  };
};
