import { Router } from "express";
import {
  getNotes,
  postNote,
  putNote,
  removeNote,
} from "../controllers/notes.controller.js";
import {
  createNoteSchema,
  updateNoteSchema,
} from "../validators/note.validator.js";
import { validateAndLog } from "../middleware/validateAndLog.middleware.js";

const router = Router();

router.get("/", validateAndLog(), getNotes); // فقط logging

router.post("/", validateAndLog(createNoteSchema), postNote); // validation + logging

router.put("/:id", validateAndLog(updateNoteSchema), putNote); // validation + logging

router.delete("/:id", validateAndLog(), removeNote); // فقط logging

export default router;
