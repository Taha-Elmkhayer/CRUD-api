import "dotenv/config";
import express from "express";
import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";
import authMidlleware from "./middleware/auth.js";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

// app.set("strict routing", false);

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

app.use("/notes", authMidlleware, notesRouter);

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
