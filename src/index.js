import "dotenv/config";
import express from "express";
import notesRouter from "./routes/notes.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.set("strict routing", false);

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

app.use("/notes", notesRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
