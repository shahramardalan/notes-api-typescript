import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/notes", notesRouter);

app.use("/auth", authRoutes);

export default app;
