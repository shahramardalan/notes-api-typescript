import express from "express";
import * as notesController from "../controllers/notes.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, notesController.getNotes);
router.get("/:id", authMiddleware, notesController.getNoteById);
router.post("/", authMiddleware, notesController.createNote);
router.put("/:id", authMiddleware, notesController.updateNote);
router.delete("/:id", authMiddleware, notesController.deleteNote);

export default router;
