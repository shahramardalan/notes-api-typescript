import { Router } from "express";
import { getNotes, postNote } from "../controllers/notes.controller";

const router = Router();

router.get("/", getNotes);
router.post("/", postNote);

export default router;
