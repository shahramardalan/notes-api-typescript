import { Router } from "express";
import {
  getNotes,
  postNote,
  putNote,
  removeNote,
} from "../controllers/notes.controller";

const router = Router();

router.get("/", getNotes);
router.post("/", postNote);
router.put("/:id", putNote); // UPDATE
router.delete("/:id", removeNote); // DELETE

export default router;
