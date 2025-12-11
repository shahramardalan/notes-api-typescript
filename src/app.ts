import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/notes", notesRouter);

export default app;
