import { PrismaClient, Note } from "@prisma/client";

const prisma = new PrismaClient();

export class NoteService {
  // گرفتن همه Note های کاربر
  async getNotes(userId: string): Promise<Note[]> {
    return prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  // گرفتن یک Note خاص (و فقط اگر متعلق به کاربر باشد)
  async getNoteById(id: string, userId: string): Promise<Note | null> {
    return prisma.note.findFirst({
      where: { id, userId },
    });
  }

  // ایجاد Note جدید
  async createNote(
    userId: string,
    title: string,
    content: string
  ): Promise<Note> {
    return prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });
  }

  // به‌روزرسانی Note (فقط اگر متعلق به کاربر باشد)
  async updateNote(
    id: string,
    userId: string,
    title: string,
    content: string
  ): Promise<Note | null> {
    // مطمئن می‌شویم کاربر فقط Note خودش را ویرایش کند
    const note = await prisma.note.findFirst({ where: { id, userId } });
    if (!note) return null;

    return prisma.note.update({
      where: { id },
      data: { title, content, updatedAt: new Date() },
    });
  }

  // حذف Note (فقط اگر متعلق به کاربر باشد)
  async deleteNote(id: string, userId: string): Promise<Note | null> {
    const note = await prisma.note.findFirst({ where: { id, userId } });
    if (!note) return null;

    return prisma.note.delete({
      where: { id },
    });
  }
}
